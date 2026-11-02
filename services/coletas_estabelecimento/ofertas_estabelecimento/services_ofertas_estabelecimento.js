/**********************************************************************************************************************
 * Objetivo: Arquivo responsável pelas regras de negócio para ACEITAR e RECUSAR OFERTAS recebidas pelo ESTABELECIMENTO
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
**********************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../../controller/modulo/configMessages.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const aceitarOfertaSchema = require('../../../schema/oferta_aceita_estabelecimento/schema_oferta_aceita_estabelecimento.js')
const validarDados = require('../../../utils/validarDados.js')

// IMPORT DAS DAOs das ofertas
const ofertaInicialDAO = require('../../../model/DAO/coletas_estabelecimento/ofertas/oferta_inicial/oferta_inicial.js')
const ofertaAceitaDAO = require('../../../model/DAO/coletas_estabelecimento/ofertas/oferta_aceita/oferta_aceita.js')
const ofertaFinalDAO = require('../../../model/DAO/coletas_estabelecimento/ofertas/oferta_final/oferta_final.js')

// INTERMEDIÁRIA DE HISTÓRICO DA OFERTA
const statusOfertaHistoricoDAO = require('../../../model/DAO/coletas_estabelecimento/ofertas/status_oferta_historico/status_oferta_historico.js')

// IMPORT DAS DAOs DO RESÍDUO
const residuoDAO = require('../../../model/DAO/meus_residuos_estabelecimento/residuos/residuo/residuo.js')
const statusResiduoHistoricoDAO = require('../../../model/DAO/meus_residuos_estabelecimento/residuos/status_residuo_historico/status_residuo_historico.js')

// IMPORT DAS DAOs DA COLETA
const coletaDAO = require('../../../model/DAO/coletas_estabelecimento/coletas/coleta/coleta.js')
const statusColetaHistoricoDAO = require('../../../model/DAO/coletas_estabelecimento/coletas/status_coleta_historico/status_coleta_historico.js')

// IMPORT DA CONFIGURAÇÃO GLOBAL DO KNEX
const knexConection = require('../../../model/global_knex/global_knex.js')

// Função para validar os dados da aceitação de oferta
const validarDadosAceitarOferta = function (oferta) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(aceitarOfertaSchema, oferta, customMessages)
}

// Função para aceitar uma oferta recebida pelo estabelecimento
const aceitarOfertaService = async function (oferta, idEstabelecimento, idOfertaInicial) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let transaction

    try {
        // Valida os dados da aceitação
        let validacao = validarDadosAceitarOferta(oferta)

        if (validacao)
            return validacao

        // Valida o ID do estabelecimento autenticado
        let validarEstabelecimento = validarDados.validarId(idEstabelecimento, customMessages)

        if (validarEstabelecimento)
            return validarEstabelecimento

        // Valida o ID da oferta inicial
        let validarOferta = validarDados.validarId(idOfertaInicial, customMessages)

        if (validarOferta)
            return validarOferta

        // Inicia a transação
        transaction = await knexConection.transaction()

        // Consulta a oferta para identificar o resíduo vinculado
        let ofertaAtual = await ofertaInicialDAO.selectByIdOfertaInicial(
            idOfertaInicial,
            transaction
        )

        if (ofertaAtual === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        if (ofertaAtual.length === 0) {
            await transaction.rollback()
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado
        }

        let idResiduo = ofertaAtual[0].id_residuo

        // Consulta e bloqueia o resíduo até o commit ou rollback, verificando se pertence ao estabelecimento autenticado
        let residuoAtual = await residuoDAO.selectResiduoForUpdate(
            idResiduo,
            idEstabelecimento,
            transaction
        )

        if (residuoAtual === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        if (residuoAtual.length === 0) {
            await transaction.rollback()
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado
        }

        // Verifica se o resíduo está disponível
        if (residuoAtual[0].status_residuo !== 'Disponível') {
            await transaction.rollback()

            customMessages.ERROR_CONFLICT.message = 'Este resíduo não está disponível para aceitar ofertas.'
            return customMessages.ERROR_CONFLICT // 409, resíduo indisponível para aceite de ofertas
        }

        // Verifica o status atual da oferta após bloquear o resíduo (verificando novamente se a oferta continua Pendente)
        ofertaAtual = await ofertaInicialDAO.selectByIdOfertaInicialForUpdate(
            idOfertaInicial,
            transaction
        )

        if (ofertaAtual === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Verifica se a oferta continua pendente e vinculada ao mesmo resíduo
        if (ofertaAtual.length === 0 || ofertaAtual[0].id_residuo !== idResiduo) {
            await transaction.rollback()
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado
        }

        if (ofertaAtual[0].status_oferta !== 'Pendente') {
            await transaction.rollback()
            customMessages.ERROR_CONFLICT.message = 'Esta oferta não está pendente para aceitação.'
            return customMessages.ERROR_CONFLICT // 409, oferta não está mais pendente
        }

        // Prepara os dados da oferta aceita
        let dadosOfertaAceita = {
            nome_aceitante: oferta.nome_aceitante.trim(),
            id_estabelecimento: idEstabelecimento
        }

        // Insere a oferta aceita
        let idOfertaAceita = await ofertaAceitaDAO.insertOfertaAceita(
            dadosOfertaAceita,
            transaction
        )

        if (idOfertaAceita === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Prepara os dados da oferta final
        let dadosOfertaFinal = {
            id_oferta_inicial: idOfertaInicial,
            id_oferta_aceita: idOfertaAceita
        }

        // Insere a oferta final
        let idOfertaFinal = await ofertaFinalDAO.insertOfertaFinal(
            dadosOfertaFinal,
            transaction
        )

        if (idOfertaFinal === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Cria a coleta vinculada à oferta final
        let dadosColeta = {
            id_oferta_final: idOfertaFinal
        }

        let idColeta = await coletaDAO.insertColeta(
            dadosColeta,
            transaction
        )

        if (idColeta === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Insere o status inicial de Agendada no histórico da coleta
        let idHistoricoColeta = await statusColetaHistoricoDAO.insertStatusColetaAgendada(
            idColeta,
            transaction
        )

        if (idHistoricoColeta === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Insere o status Aceita no histórico da oferta escolhida
        let idHistoricoOferta = await statusOfertaHistoricoDAO.insertStatusOfertaAceita(
            idOfertaInicial,
            transaction
        )

        if (idHistoricoOferta === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Recusa automaticamente as outras ofertas pendentes do mesmo resíduo
        let ofertasRecusadas = await statusOfertaHistoricoDAO.recusarOfertasPendentesResiduo(
            idResiduo,
            idEstabelecimento,
            transaction
        )

        // Se retornar 0 das ofertasRecusadas, significa que não havia outras ofertas pendentes
        if (ofertasRecusadas === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Insere Agendado no histórico do resíduo
        let idHistoricoResiduo = await statusResiduoHistoricoDAO.insertStatusResiduoAgendado(
            idResiduo,
            idEstabelecimento,
            transaction
        )

        if (idHistoricoResiduo === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Confirma todas as operações
        await transaction.commit()

        // Prepara a resposta
        let resposta = {
            id_oferta_inicial: Number(idOfertaInicial),
            id_oferta_aceita: idOfertaAceita,
            id_oferta_final: idOfertaFinal,
            id_residuo: idResiduo,
            id_coleta: idColeta,
            nome_aceitante: dadosOfertaAceita.nome_aceitante,
            status_oferta: 'Aceita',
            status_residuo: 'Agendado',
            status_coleta: 'Agendada',
            ofertas_recusadas: ofertasRecusadas
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = 'Oferta aceita e coleta agendada com sucesso.'
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE

    } catch (error) {

        // Desfaz as operações se a transação ainda estiver ativa
        if (transaction && !transaction.isCompleted())
            await transaction.rollback()

        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062)
            return customMessages.ERROR_CONFLICT

        return customMessages.ERROR_INTERNAL_SERVER_SERVICES
    }
}

// Função para recusar uma oferta recebida pelo estabelecimento
const recusarOfertaService = async function (idOfertaInicial, idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let transaction

    try {
        // Valida o ID da oferta inicial
        let validarOferta = validarDados.validarId(idOfertaInicial, customMessages)

        if (validarOferta)
            return validarOferta

        // Valida o ID do estabelecimento autenticado
        let validarEstabelecimento = validarDados.validarId(idEstabelecimento, customMessages)

        if (validarEstabelecimento)
            return validarEstabelecimento

        // Inicia a transação
        transaction = await knexConection.transaction()

        // Consulta a oferta para identificar o resíduo vinculado
        let ofertaAtual = await ofertaInicialDAO.selectByIdOfertaInicial(
            idOfertaInicial,
            transaction
        )

        if (ofertaAtual === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        if (ofertaAtual.length === 0) {
            await transaction.rollback()
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado
        }

        let idResiduo = ofertaAtual[0].id_residuo

        // Consulta e bloqueia o resíduo até o commit ou rollback, verificando se pertence ao estabelecimento autenticado
        let residuoAtual = await residuoDAO.selectResiduoForUpdate(
            idResiduo,
            idEstabelecimento,
            transaction
        )

        if (residuoAtual === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        if (residuoAtual.length === 0) {
            await transaction.rollback()
            return customMessages.ERROR_NOT_FOUND
        }

        // Verifica se o resíduo está disponível para receber ofertas
        if (residuoAtual[0].status_residuo !== 'Disponível') {
            await transaction.rollback()

            customMessages.ERROR_CONFLICT.message = 'Este resíduo não está disponível para recusar ofertas.'
            return customMessages.ERROR_CONFLICT // 409, resíduo indisponível para recusa de ofertas
        }

        // Consulta e bloqueia a oferta para verificar seu status mais recente
        ofertaAtual = await ofertaInicialDAO.selectByIdOfertaInicialForUpdate(
            idOfertaInicial,
            transaction
        )

        if (ofertaAtual === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        if (ofertaAtual.length === 0 || ofertaAtual[0].id_residuo !== idResiduo) {
            await transaction.rollback()
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado
        }

        // Verifica se a oferta continua pendente
        if (ofertaAtual[0].status_oferta !== 'Pendente') {
            await transaction.rollback()

            customMessages.ERROR_CONFLICT.message = 'Esta oferta não está pendente para recusa.'
            return customMessages.ERROR_CONFLICT // 409, oferta não está mais pendente
        }

        // Insere Recusada no histórico da oferta
        let idHistoricoOferta = await statusOfertaHistoricoDAO.insertStatusOfertaRecusada(
            idOfertaInicial,
            transaction
        )

        if (idHistoricoOferta === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Confirma a recusa
        await transaction.commit()

        // Prepara a resposta
        let resposta = {
            id_oferta_inicial: Number(idOfertaInicial),
            id_residuo: idResiduo,
            id_historico_oferta: idHistoricoOferta,
            status_oferta: 'Recusada'
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = 'Oferta recusada com sucesso.'
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE

    } catch (error) {

        // Desfaz as operações se a transação ainda estiver ativa
        if (transaction && !transaction.isCompleted())
            await transaction.rollback()

        return customMessages.ERROR_INTERNAL_SERVER_SERVICES
    }
}


module.exports = {
    aceitarOfertaService,
    recusarOfertaService
}
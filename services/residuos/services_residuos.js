/******************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas ao RESÍDUO
 * Data: 28/10/2026 - (quarta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
******************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../controller/modulo/configMessages.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const cadastroResiduoSchema = require('../../schema/residuos/schema_residuos.js')
const validarDados = require('../../utils/validarDados.js')

// IMPORT DAS DAOs
const residuoDAO = require('../../model/DAO/residuos/residuo/residuo.js')
const statusResiduoHistoricoDAO = require('../../model/DAO/residuos/status_residuo_historico/status_residuo_historico.js')
const statusOfertaHistoricoDAO = require('../../model/DAO/residuos/status_oferta_historico/status_oferta_historico.js')

// IMPORT DA CONFIGURAÇÃO GLOBAL DO KNEX (PARA EXECUTAR A TRANSACTION)
const knexConection = require('../../model/global_knex/global_knex.js')


// Função para validar os dados do cadastro e atualização do resíduo
const validarDadosResiduo = function (residuo) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(cadastroResiduoSchema, residuo, customMessages)
}

// Função para converter a data brasileira para o formato ISO 8601 (AAAA-MM-DD)
const converterDataParaISO = function (data) {
    let [dia, mes, ano] = data.split('/')

    return `${ano}-${mes}-${dia}`
}

// Função para cadastrar um novo resíduo
const cadastrarResiduoService = async function (residuo, idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let transaction

    try {
        // Valida os dados do resíduo
        let validacao = validarDadosResiduo(residuo)

        if (validacao)
            return validacao

        // Valida o ID do estabelecimento autenticado
        let validarEstabelecimento = validarDados.validarId(idEstabelecimento, customMessages)

        if (validarEstabelecimento)
            return validarEstabelecimento

        // Prepara os dados do resíduo
        let dadosResiduo = {
            horario_inicial: residuo.horario_inicial,
            horario_final: residuo.horario_final,
            quantidade: residuo.quantidade,
            data_disponivel: converterDataParaISO(residuo.data_disponivel),
            observacao: residuo.observacao ?? null,
            id_tipo_material: Number(residuo.id_tipo_material),
            id_estabelecimento: Number(idEstabelecimento)
        }

        // Inicia a transação
        transaction = await knexConection.transaction()

        // Insere o resíduo
        let idResiduo = await residuoDAO.insertResiduo(dadosResiduo, transaction)

        if (idResiduo === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Insere o status inicial Disponível no histórico
        let idHistorico = await statusResiduoHistoricoDAO.insertStatusResiduoDisponivel(
            idResiduo,
            dadosResiduo.id_estabelecimento,
            transaction
        )

        if (idHistorico === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Confirma todas as operações
        await transaction.commit()

        // Prepara a resposta
        let resposta = {
            id: idResiduo,
            horario_inicial: dadosResiduo.horario_inicial,
            horario_final: dadosResiduo.horario_final,
            quantidade: dadosResiduo.quantidade,
            data_disponivel: residuo.data_disponivel,
            observacao: dadosResiduo.observacao,
            id_tipo_material: dadosResiduo.id_tipo_material,
            id_estabelecimento: dadosResiduo.id_estabelecimento,
            status_residuo: 'Disponível'
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
        customMessages.DEFAULT_MESSAGE.message = 'Resíduo cadastrado com sucesso.'
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE // 201, item criado

    } catch (error) {

        // Desfaz as operações se a transação ainda estiver ativa
        if (transaction && !transaction.isCompleted())
            await transaction.rollback()

        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062)
            return customMessages.ERROR_CONFLICT

        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para atualizar um resíduo do estabelecimento
const atualizarResiduoService = async function (residuo, idEstabelecimento, idResiduo) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let transaction

    try {
        // Valida os dados do resíduo
        let validacao = validarDadosResiduo(residuo)

        if (validacao)
            return validacao

        // Valida o ID do estabelecimento autenticado
        let validarEstabelecimento = validarDados.validarId(idEstabelecimento, customMessages)

        if (validarEstabelecimento)
            return validarEstabelecimento

        // Valida o ID do resíduo
        let validarResiduo = validarDados.validarId(idResiduo, customMessages)

        if (validarResiduo)
            return validarResiduo

        // Prepara os dados do resíduo
        let dadosResiduo = {
            id: Number(idResiduo),
            horario_inicial: residuo.horario_inicial,
            horario_final: residuo.horario_final,
            quantidade: residuo.quantidade,
            data_disponivel: converterDataParaISO(residuo.data_disponivel),
            observacao: residuo.observacao ?? null,
            id_tipo_material: Number(residuo.id_tipo_material),
            id_estabelecimento: Number(idEstabelecimento)
        }

        // Inicia a transação
        transaction = await knexConection.transaction()

        // Busca o resíduo e bloqueia seu registro durante a transação
        let residuoAtual = await residuoDAO.selectResiduoForUpdate(
            dadosResiduo.id,
            dadosResiduo.id_estabelecimento,
            transaction
        )

        if (residuoAtual === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Verifica se o resíduo existe e pertence ao estabelecimento
        if (residuoAtual.length === 0) {
            await transaction.rollback()
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado
        }

        // Verifica se o resíduo está disponível para edição
        if (residuoAtual[0].status_residuo !== 'Disponível') {
            await transaction.rollback()

            customMessages.ERROR_CONFLICT.message = 'Este resíduo não está disponível para edição.'
            return customMessages.ERROR_CONFLICT // 409, conflito
        }

        // Atualiza os atributos do resíduo
        let resultAtualizacao = await residuoDAO.updateResiduo(dadosResiduo, transaction)

        if (resultAtualizacao === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Confirma a atualização
        await transaction.commit()

        // Prepara a resposta
        let resposta = {
            id: dadosResiduo.id,
            horario_inicial: dadosResiduo.horario_inicial,
            horario_final: dadosResiduo.horario_final,
            quantidade: dadosResiduo.quantidade,
            data_disponivel: residuo.data_disponivel,
            observacao: dadosResiduo.observacao,
            id_tipo_material: dadosResiduo.id_tipo_material,
            id_estabelecimento: dadosResiduo.id_estabelecimento,
            status_residuo: 'Disponível'
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = 'Resíduo atualizado com sucesso.'
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE // 200, atualizado

    } catch (error) {

        // Desfaz as operações se a transação ainda estiver ativa
        if (transaction && !transaction.isCompleted())
            await transaction.rollback()

        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para cancelar um resíduo do estabelecimento
const cancelarResiduoService = async function (idResiduo, idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let transaction

    try {
        // Valida o ID do resíduo
        let validarResiduo = validarDados.validarId(idResiduo, customMessages)

        if (validarResiduo)
            return validarResiduo

        // Valida o ID do estabelecimento autenticado
        let validarEstabelecimento = validarDados.validarId(idEstabelecimento, customMessages)

        if (validarEstabelecimento)
            return validarEstabelecimento

        // Inicia a transação
        transaction = await knexConection.transaction()

        // Busca o resíduo e bloqueia seu registro durante a transação
        let residuoAtual = await residuoDAO.selectResiduoForUpdate(
            Number(idResiduo),
            Number(idEstabelecimento),
            transaction
        )

        if (residuoAtual === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Verifica se o resíduo existe e pertence ao estabelecimento
        if (residuoAtual.length === 0) {
            await transaction.rollback()
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado
        }

        // Verifica se o resíduo está disponível para cancelamento
        if (residuoAtual[0].status_residuo !== 'Disponível') {
            await transaction.rollback()

            customMessages.ERROR_CONFLICT.message = 'Este resíduo não está disponível para cancelamento.'
            return customMessages.ERROR_CONFLICT // 409, conflito
        }

        // Insere o status Cancelado no histórico do resíduo
        let idHistorico = await statusResiduoHistoricoDAO.insertStatusResiduoCancelado(
            Number(idResiduo),
            Number(idEstabelecimento),
            transaction
        )

        if (idHistorico === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Recusa todas as ofertas pendentes vinculadas ao resíduo cancelado
        let ofertasRecusadas = await statusOfertaHistoricoDAO.recusarOfertasPendentesResiduo(
            Number(idResiduo),
            Number(idEstabelecimento),
            transaction
        )

        if (ofertasRecusadas === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Confirma o cancelamento
        await transaction.commit()

        // Prepara a resposta
        let resposta = {
            id_residuo: Number(idResiduo),
            id_historico: idHistorico,
            status_residuo: 'Cancelado'
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = 'Resíduo cancelado com sucesso.'
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE // 200, cancelado

    } catch (error) {

        // Desfaz as operações se a transação ainda estiver ativa
        if (transaction && !transaction.isCompleted())
            await transaction.rollback()

        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}


module.exports = {
    cadastrarResiduoService,
    atualizarResiduoService,
    cancelarResiduoService
}
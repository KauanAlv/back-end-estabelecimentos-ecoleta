/***************************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas a TELA HOME DO ESTABELECIMENTO
 * Data: 22/10/2026 - (quinta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
***************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../controller/modulo/configMessages.js')

const validarDados = require('../../utils/validarDados.js')

// IMPORT DA DAO
const meusResiduosEstabelecimentoDAO = require('../../model/DAO/meus_residuos_estabelecimento/meus_residuos_estabelecimento.js')

// Função para validar os IDs utilizados nas consultas dos resíduos
const validarDadosConsultaMeusResiduosEstabelecimento = function (idEstabelecimento, idResiduo = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    // Valida o ID da empresa coletora autenticada
    let validarEstabelecimento = validarDados.validarId(idEstabelecimento, customMessages)

    if (validarEstabelecimento)
        return validarEmpresa

    // Valida o ID do resíduo, quando informado
    if (idResiduo !== null) {
        let validarResiduo = validarDados.validarId(idResiduo, customMessages)

        if (validarResiduo)
            return validarResiduo
    }

    return null
}

// Função para formatar a data no padrão brasileiro
const formatarData = function (data) {
    if (!data)
        return null

    return new Date(data).toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
    })
}

// Função para buscar todos os resíduos da tela
const buscarMeusResiduosEstabelecimento = async function (idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        // Valida os dados da consulta
        let validacao = validarDadosConsultaMeusResiduosEstabelecimento(idEstabelecimento)

        if (validacao) {
            return validacao
        }

        // Busca todos os resíduos visíveis para a empresa coletora
        let residuos = await meusResiduosEstabelecimentoDAO.selectMeusResiduosEstabelecimento(idEstabelecimento)

        if (residuos === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        // Verifica se existem resíduos
        if (residuos.length === 0)
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado

        // Formata a data disponível de todos os resíduos para o padrão brasileiro
        for (let residuo of residuos) {
            residuo.data_disponivel = formatarData(residuo.data_disponivel)
        }

        // Prepara a resposta
        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.response = residuos

        return customMessages.DEFAULT_MESSAGE // 200, sucesso

    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para buscar os detalhes de um resíduo disponível
const buscarMeuResiduoDisponivelById = async function (idEstabelecimento, idResiduo) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        // Valida os dados da consulta
        let validacao = validarDadosConsultaMeusResiduosEstabelecimento(idEstabelecimento, idResiduo)

        if (validacao) {
            return validacao
        }

        // Busca os detalhes do resíduo disponível
        let residuo = await meusResiduosEstabelecimentoDAO.selectMeuResiduoEstabelecimento(idEstabelecimento, idResiduo)

        if (residuo === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        // Verifica se o resíduo foi encontrado
        if (residuo.length === 0)
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado


        // Formata a data disponível do resíduo para o padrão brasileiro
        residuo[0].data_disponivel = formatarData(residuo[0].data_disponivel)

        // Prepara a resposta
        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.response = residuo[0]

        return customMessages.DEFAULT_MESSAGE // 200, sucesso

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}


module.exports = {
    buscarMeusResiduosEstabelecimento,
    buscarMeuResiduoDisponivelById
}
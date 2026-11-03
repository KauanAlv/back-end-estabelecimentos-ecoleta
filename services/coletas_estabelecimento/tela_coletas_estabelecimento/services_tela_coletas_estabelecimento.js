/**********************************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas a TELA DE HISTÓRICO DO ESTABELECIMENTO
 * Data: 03/11/2026 - (sexta-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
**********************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../../controller/modulo/configMessages.js')

// IMPORT DA DAO
const telaColetasEstabelecimentoDAO = require('../../../model/DAO/coletas_estabelecimento/coletas/tela_coletas/tela_coletas.js')

// Função para formatar a data no padrão brasileiro
const formatarData = function (data) {
    if (!data)
        return null

    return new Date(data).toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
    })
}

// Busca os dados do histórico para o estabelecimento
const listarColetasEstabelecimentoService = async function (idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultResumo = await telaColetasEstabelecimentoDAO.selectAllColetasEstabelecimento(idEstabelecimento)

        if (resultResumo === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        // Verifica se a empresa foi encontrada
        if (resultResumo.length === 0)
            return customMessages.ERROR_NOT_FOUND // 404, empresa não encontrada


        // Formata a data disponível das ofertas
        for (let oferta of resultResumo) {
            oferta.data_disponivel = formatarData(oferta.data_disponivel)

            // Remove o atributo utilizado apenas para ordenação
            delete oferta.data_hora_evento
        }

        // Prepara a resposta
        let resposta = {
            resumo: resultResumo
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_RESPONSE.message
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE // 200, consulta realizada

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

const buscarColetasEstabelecimentoService = async function (idEstabelecimento, idOfertaInicial) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultResumo = await telaColetasEstabelecimentoDAO.selectColetaHistoricoEstabelecimento(idEstabelecimento, idOfertaInicial)

        if (resultResumo === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        // Verifica se a empresa foi encontrada
        if (resultResumo.length === 0)
            return customMessages.ERROR_NOT_FOUND // 404, empresa não encontrada


        // Formata a data disponível das ofertas
        for (let oferta of resultResumo) {
            oferta.data_disponivel = formatarData(oferta.data_disponivel)

            // Remove o atributo utilizado apenas para ordenação
            delete oferta.data_hora_evento
        }

        // Prepara a resposta
        let resposta = {
            resumo: resultResumo
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_RESPONSE.message
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE // 200, consulta realizada

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}





module.exports = {
    listarColetasEstabelecimentoService,
    buscarColetasEstabelecimentoService
}
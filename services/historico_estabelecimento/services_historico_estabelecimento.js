/***************************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas a TELA HOME DO ESTABELECIMENTO
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
***************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../controller/modulo/configMessages.js')

// IMPORT DA DAO
const historicoEstabelecimentoDAO = require('../../model/DAO/historico_estabelecimento/historico_estabelecimento.js')

// Função para formatar a data no padrão brasileiro
const formatarData = function (data) {
    if (!data)
        return null

    return new Date(data).toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
    })
}

// Busca os dados da Home da empresa coletora
const buscarHistoricoEstabelecimentoService = async function (idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultResumo = await historicoEstabelecimentoDAO.selectHistoricoEstabelecimento(idEstabelecimento)

        if (resultResumo === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        // Verifica se a empresa foi encontrada
        if (resultResumo.length === 0)
            return customMessages.ERROR_NOT_FOUND // 404, empresa não encontrada


        if (resultResumo === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        // Formata a data disponível das ofertas
        for (let oferta of resultResumo) {
            oferta.data_disponivel = formatarData(oferta.data_disponivel)
        }

        // Prepara a resposta
        let resposta = {
            resumo: resultResumo[0]
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_RESPONSE.message
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE // 200, consulta realizada

    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

module.exports = {
    buscarHistoricoEstabelecimentoService
}
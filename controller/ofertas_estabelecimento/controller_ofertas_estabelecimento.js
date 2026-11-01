/**************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas à ACEITAÇÃO E RECUSA DE OFERTAS PELO ESTABELECIMENTO e retornar as respostas da API
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
**************************************************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../modulo/configMessages.js')

// IMPORT DA SERVICE
const ofertasService = require('../../services/ofertas_estabelecimento/services_ofertas_estabelecimento.js')

// Aceitar uma oferta recebida pelo estabelecimento
const aceitarOferta = async function (oferta, contentType, idEstabelecimento, idOfertaInicial) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await ofertasService.aceitarOfertaService(
                oferta,
                idEstabelecimento,
                idOfertaInicial
            )

            return result

        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Recusar uma oferta recebida pelo estabelecimento
const recusarOferta = async function (idOfertaInicial, idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await ofertasService.recusarOfertaService(
            idOfertaInicial,
            idEstabelecimento
        )

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

module.exports = {
    aceitarOferta,
    recusarOferta
}
/************************************************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas a TELA DE HISTÓRICO DO ESTABELECIMENTO e retornar as respostas da API
 * Data: 03/11/2026 - (sexta-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
***********************************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../modulo/configMessages.js')

// IMPORT DA SERVICE
const TelaColetasEstabelecimentoService = require('../../../services/coletas_estabelecimento/tela_coletas_estabelecimento/services_tela_coletas_estabelecimento.js')

const listarColetasEstabelecimento = async function (idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await TelaColetasEstabelecimentoService.listarColetasEstabelecimentoService(idEstabelecimento)

        return result

        
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

const buscarColetasEstabelecimento = async function (idEstabelecimento, idOfertaInicial) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await TelaColetasEstabelecimentoService.buscarColetasEstabelecimentoService(idEstabelecimento, idOfertaInicial)

        return result

        
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}


module.exports = {
    listarColetasEstabelecimento,
    buscarColetasEstabelecimento
}
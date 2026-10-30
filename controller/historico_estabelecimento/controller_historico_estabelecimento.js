/*****************************************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas a TELA HOME DO ESTABELECIMENTO e retornar as respostas da API
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
*****************************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../modulo/configMessages.js')

// IMPORT DA SERVICE
const HistoricoEstabelecimentoService = require('../../services/historico_estabelecimento/services_historico_estabelecimento.js')

// Realizar o login do estabelecimento
const buscarHistoricoEstabelecimento = async function (idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await HistoricoEstabelecimentoService.buscarHistoricoEstabelecimentoService(idEstabelecimento)

        return result

        
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

module.exports = {
    buscarHistoricoEstabelecimento
}
/*****************************************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas a TELA HOME DO ESTABELECIMENTO e retornar as respostas da API
 * Data: 28/10/2026 - (quarta-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
*****************************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../modulo/configMessages.js')

// IMPORT DA SERVICE
const HomeEstabelecimentoService = require('../../services/home_estabelecimento/services_home_estabelecimento.js')

// Realizar o login do estabelecimento
const buscarHomeEstabelecimento = async function (idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await HomeEstabelecimentoService.buscarHomeEmpresaColetoraService(idEstabelecimento)

        return result

        
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

module.exports = {
    buscarHomeEstabelecimento
}
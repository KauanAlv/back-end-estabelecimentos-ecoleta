/*****************************************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas ao CADASTRO DO ESTABELECIMENTO e retornar as respostas da API
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
*****************************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../modulo/configMessages.js')

// IMPORT DA SERVICE
const cadastroEstabelecimentoService = require('../../services/cadastro_estabelecimento/services_cadastro_estabelecimento.js')

// Cadastrar um novo estabelecimento
const cadastrarEstabelecimento = async function (cadastroEstabelecimento, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await cadastroEstabelecimentoService.cadastrarEstabelecimentoService(cadastroEstabelecimento)

            return result

        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}


module.exports = {
    cadastrarEstabelecimento
}
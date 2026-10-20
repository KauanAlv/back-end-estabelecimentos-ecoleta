/********************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas ao ENDEREÇO e retornar as respostas da API
 * Data: 20/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
 ********************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../modulo/configMessages.js')

// IMPORT DA SERVICE
const enderecoService = require('../../services/endereco/services_endereco.js')

// Inserir uma nova endereco
const inserirNovaEndereco = async function (endereco, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await enderecoService.inserirEnderecoService(endereco)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Atualizar uma endereco
const atualizarEndereco = async function (endereco, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let result = await enderecoService.atualizarEnderecoService(endereco, id)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Listar as enderecos
const listarEndereco = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await enderecoService.listarEnderecoService()

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Buscar uma endereco
const buscarEndereco = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await enderecoService.buscarEnderecoService(id)

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaEndereco,
    atualizarEndereco,
    listarEndereco,
    buscarEndereco
}
/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de telefone no banco de dados
 * data: 06/10/2026
 * autor: Gabriel Renato
 * versão: 1.1
 **************************************************************************************/


const configMessages = require('../modulo/configMessages.js')

// IMPORT DA SERVICE
const telefoneService = require('../../services/telefone/services_telefone.js')

// Inserir um novo telefone
const inserirNovoTelefone = async function (numero, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await telefoneService.inserirTelefoneService(numero)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Atualizar um telefone
const atualizarTelefone = async function (numero, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let result = await telefoneService.atualizarTelefoneService(numero, id)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Listar um telefone
const listarTelefone = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await telefoneService.listarTelefoneService()

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Buscar um telefone
const buscarTelefone = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await telefoneService.buscarTelefoneService(id)

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoTelefone,
    atualizarTelefone,
    listarTelefone,
    buscarTelefone
}
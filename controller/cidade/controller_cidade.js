/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de cidade no banco de dados
 * data: 09/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/

const configMessages = require('../modulo/configMessages.js')
// IMPORT DA SERVICE
const cidadeService = require('../../services/cidade/services_cidade.js')

// Inserir uma nova cidade
const inserirNovaCidade = async function (cidade, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await cidadeService.inserirCidadeService(cidade)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Atualizar uma cidade
const atualizarCidade = async function (cidade, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let result = await cidadeService.atualizarCidadeService(cidade, id)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Listar as cidades
const listarCidade = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await cidadeService.listarCidadeService()

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Buscar uma cidade
const buscarCidade = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await cidadeService.buscarCidadeService(id)

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaCidade,
    atualizarCidade,
    listarCidade,
    buscarCidade
}
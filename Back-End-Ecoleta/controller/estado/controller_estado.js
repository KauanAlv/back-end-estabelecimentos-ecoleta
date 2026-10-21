/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de estado no banco de dados
 * data: 09/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/

const configMessages = require('../modulo/configMessages.js')
// IMPORT DA SERVICE
const estadoService = require('../../services/estado/services_estado.js')

// Inserir um novo estado
const inserirNovoEstado = async function (estado, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await estadoService.inserirEstadoService(estado)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Atualizar um estado
const atualizarEstado = async function (estado, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let result = await estadoService.atualizarEstadoService(estado, id)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Listar um estado
const listarEstado = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await estadoService.listarEstadoService()

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Buscar um estado
const buscarEstado = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await estadoService.buscarEstadoService(id)

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


module.exports={
    inserirNovoEstado,
    atualizarEstado,
    listarEstado,
    buscarEstado
}
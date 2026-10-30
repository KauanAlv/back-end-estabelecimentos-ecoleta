/********************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas ao RESÍDUO e retornar as respostas da API
 * Data: 29/10/2026 - (quinta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
********************************************************************************************************************/

const configMessages = require('../modulo/configMessages.js')

// IMPORT DA SERVICE
const residuoService = require('../../services/residuos/services_residuos.js')

// Cadastrar um novo resíduo
const cadastrarResiduo = async function (residuo, contentType, idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await residuoService.cadastrarResiduoService(residuo, idEstabelecimento)

            return result

        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Atualizar um resíduo do estabelecimento
const atualizarResiduo = async function (residuo, contentType, idEstabelecimento, idResiduo) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await residuoService.atualizarResiduoService(residuo, idEstabelecimento, idResiduo)

            return result

        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Cancelar um resíduo do estabelecimento
const cancelarResiduo = async function (idResiduo, idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await residuoService.cancelarResiduoService(idResiduo, idEstabelecimento)

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

module.exports = {
    cadastrarResiduo,
    atualizarResiduo,
    cancelarResiduo
}
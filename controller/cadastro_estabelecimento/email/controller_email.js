/******************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas ao EMAIL e retornar as respostas da API
 * Data: 06/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 2.0
******************************************************************************************************************/

const configMessages = require('../../modulo/configMessages.js')
const emailService = require('../../../services/cadastro_estabelecimento/email/services_email.js')

const inserirNovoEmail = async function (email, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await emailService.inserirEmailService(email)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}


const atualizarEmail = async function (email, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let result = await emailService.atualizarEmailService(email, id)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}


const listarEmail = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await emailService.listarEmailService()

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}


const buscarEmail = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await emailService.buscarEmailService(id)

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoEmail,
    atualizarEmail,
    listarEmail,
    buscarEmail
}
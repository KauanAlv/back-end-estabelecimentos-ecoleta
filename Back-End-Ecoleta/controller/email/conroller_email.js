/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de email no banco de dados
 * data: 06/10/2026
 * autor: Gabriel Renato
 * versão: 2.0
 **************************************************************************************/

const configmessages = require('../modulo/configMessages.js')
const emailService = require('../../services/email/services_email.js')


const inserirEmail = async function (email, contentType) {
    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await emailService.inserirEmailService(email)

            return result
            
    }else{
        return modifiedmessage.ERROR_CONTENT_TYPE //415 content type
    }

    } catch (error) {
        return modifiedmessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 controller
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
    inserirEmail,
    atualizarEmail,
    listarEmail,
    buscarEmail
}
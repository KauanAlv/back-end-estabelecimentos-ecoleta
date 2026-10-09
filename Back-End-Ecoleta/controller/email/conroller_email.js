/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de email no banco de dados
 * data: 06/10/2026
 * autor: Gabriel Renato
 * versão: 1.1
 **************************************************************************************/

const configmessages = require('../modulo/configMessages.js')

const emailDAO = require('../../model/DAO/email/email.js')

const insertEmail = async function (email, contentType) {
    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(email)
            
            if(validar){
                return validar //400 
        }else { 
            let resultado = await emailDAO.insertEmail(await tratardados(email))
            if(resultado){
                email.id = resultado

                modifiedmessage.DEFAULT_MESSAGE.status = modifiedmessage.SUCCESS_CREATED_ITEM.status
                modifiedmessage.DEFAULT_MESSAGE.status_code = modifiedmessage.SUCCESS_CREATED_ITEM.status_code
                modifiedmessage.DEFAULT_MESSAGE.message = modifiedmessage.SUCCESS_CREATED_ITEM.message
                modifiedmessage.DEFAULT_MESSAGE.response = email

                return modifiedmessage.DEFAULT_MESSAGE
            }else{
                return modifiedmessage.ERROR_INTERNAL_SERVER_MODEL //500 model
            }
        }
    }else{
        return modifiedmessage.ERROR_CONTENT_TYPE //415 content type
    }

    } catch (error) {
        return modifiedmessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 controller
    }
}

const atualizarEmail = async function(email, contentType, id){
    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultValidarID = buscarEmail(id)

            if(resultValidarID.status){
                let validar = await validarDados(email)

                if(!validar){
                    email.id = Number(id)
                    let dadostratados = await tratardados(email)
                    let resultado = await emailDAO.updateEmail({
                        id: email.id,
                        email: dadostratados.email})

                        if(resultado){
                            modifiedmessage.DEFAULT_MESSAGE.status          = modifiedmessage.SUCCESS_UPDATED_ITEM.status
                            modifiedmessage.DEFAULT_MESSAGE.status_code     = modifiedmessage.SUCCESS_UPDATED_ITEM.status_code
                            modifiedmessage.DEFAULT_MESSAGE.message         = modifiedmessage.SUCCESS_UPDATED_ITEM.message
                            modifiedmessage.DEFAULT_MESSAGE.response        = email
                            
                            return modifiedmessage.DEFAULT_MESSAGE
                        }else{
                            return modifiedmessage.ERROR_INTERNAL_SERVER_MODEL //500 model
                        }
                }else{
                    return validar //400 bad request
                }
            }else{
                return resultValidarID //404 not found
            }
        }else{
            return modifiedmessage.ERROR_CONTENT_TYPE //415 content type
        }
        
    }
    catch (error) {
        return modifiedmessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 controller
    }
}

const listarEmail = async function(){
    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    try {

        let result = await emailDAO.selectAllEmail()

        if(result){
            if(result.length > 0){

                modifiedmessage.DEFAULT_MESSAGE.status          = modifiedmessage.SUCCESS_RESPONSE.status
                modifiedmessage.DEFAULT_MESSAGE.status_code     = modifiedmessage.SUCCESS_RESPONSE.status_code
                modifiedmessage.DEFAULT_MESSAGE.response.count  = result.length
                modifiedmessage.DEFAULT_MESSAGE.response.email  = result

                return modifiedmessage.DEFAULT_MESSAGE

            }else{
                return modifiedmessage.ERROR_NOT_FOUND //404 not found
            }

        }else{
            return modifiedmessage.ERROR_INTERNAL_SERVER_MODEL //500 model
        }

    }
    catch (error) {
        return modifiedmessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 controller
    }
}

const buscarEmail = async function(email, contentType, id){
    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    try {

        if(id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0){
            modifiedmessage.ERROR_BAD_REQUEST.field = '[ID] invalido'
            return modifiedmessage.ERROR_BAD_REQUEST //400 bad request
        }else{
            let result = await emailDAO.selectByIdEmail(id)
            if(result){
                if(result.length > 0){

                    modifiedmessage.DEFAULT_MESSAGE.status          = modifiedmessage.SUCCESS_RESPONSE.status
                    modifiedmessage.DEFAULT_MESSAGE.status_code     = modifiedmessage.SUCCESS_RESPONSE.status_code
                    modifiedmessage.DEFAULT_MESSAGE.response        = result

                    return modifiedmessage.DEFAULT_MESSAGE

                }else{
                    return modifiedmessage.ERROR_NOT_FOUND //404 not found
                }

            }else{
                return modifiedmessage.ERROR_INTERNAL_SERVER_MODEL //500 model
            }
        }

    }
    catch (error) {
        return modifiedmessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 controller
    }
}


const validarDados = async function(email){

    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    if(email.email == undefined || email.email == null || email.email == '' || email.email.length > 256){

        modifiedmessage.ERROR_BAD_REQUEST.field = '[EMAIL] invalido, verifique se o campo foi preenchido corretamente'
        return modifiedmessage.ERROR_BAD_REQUEST //400 bad request

    } else {
        return false
    }
}


const tratardados = async function(email){
    email.email = email.email.replaceAll("'", "")
}

module.exports ={
    insertEmail,
    atualizarEmail,
    listarEmail,
    buscarEmail
}
const configmessages = require('../modulo/configMessages.js')

const telefoneDAO = require('../../model/DAO/telefone/telefone.js')

const insertTelefone = async function (telefone, contentType) {
    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(telefone)
            
            if(validar){
                return validar //400 
        }else {
            let resultado = await telefoneDAO.insertTelefone(await tratardados(telefone))
            if(resultado){
                telefone.id = resultado

                modifiedmessage.DEFAULT_MESSAGE.status = modifiedmessage.SUCCESS_CREATED_ITEM.status
                modifiedmessage.DEFAULT_MESSAGE.status_code = modifiedmessage.SUCCESS_CREATED_ITEM.status_code
                modifiedmessage.DEFAULT_MESSAGE.message = modifiedmessage.SUCCESS_CREATED_ITEM.message
                modifiedmessage.DEFAULT_MESSAGE.response = telefone

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

const atualizarTelefone = async function(telefone, contentType, id){
    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultValidarID = buscarTelefone(id)

            if(resultValidarID.status){
                let validar = await validarDados(telefone)

                if(!validar){
                    telefone.id = Number(id)
                    let dadostratados = await tratardados(telefone)
                    let resultado = await telefoneDAO.updateTelefone({
                        id: telefone.id,
                        telefone: dadostratados.telefone})

                        if(resultado){
                            modifiedmessage.DEFAULT_MESSAGE.status          = modifiedmessage.SUCCESS_UPDATED_ITEM.status
                            modifiedmessage.DEFAULT_MESSAGE.status_code     = modifiedmessage.SUCCESS_UPDATED_ITEM.status_code
                            modifiedmessage.DEFAULT_MESSAGE.message         = modifiedmessage.SUCCESS_UPDATED_ITEM.message
                            modifiedmessage.DEFAULT_MESSAGE.response        = telefone
                            
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

const listarTelefone = async function(){
    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    try {

        let result = await telefoneDAO.selectAllTelefone()

        if(result){
            if(result.length > 0){

                modifiedmessage.DEFAULT_MESSAGE.status          = modifiedmessage.SUCCESS_RESPONSE.status
                modifiedmessage.DEFAULT_MESSAGE.status_code     = modifiedmessage.SUCCESS_RESPONSE.status_code
                modifiedmessage.DEFAULT_MESSAGE.response.count  = result.length
                modifiedmessage.DEFAULT_MESSAGE.response.telefone  = result

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

const buscarTelefone = async function(id){
    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    try {

        if(id == undefined || String(id).replaceAll(' ', '') == '' || id == null || isNaN(id) || id <= 0){
            modifiedmessage.ERROR_BAD_REQUEST.field = '[ID] invalido'
            return modifiedmessage.ERROR_BAD_REQUEST //400 bad request
        }else{
            let result = await telefoneDAO.selectByIdTelefone(id)
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


const validarDados = async function(telefone){

    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    if(telefone.numero == undefined || telefone.numero == '' || telefone.numero.length > 25){

        modifiedmessage.ERROR_BAD_REQUEST.field = '[NUMERO] invalido'
        return modifiedmessage.ERROR_BAD_REQUEST //400 bad request

    } else {
        return false
    }
}


const tratardados = async function(telefone){
    telefone.numero = telefone.numero.replaceAll("'", "")

    return telefone
}

module.exports ={
    insertTelefone,
    atualizarTelefone,
    listarTelefone,
    buscarTelefone
}
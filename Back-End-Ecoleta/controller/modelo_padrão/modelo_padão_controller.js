/**************************************************************************************
 * objetivo: arquivo responsavel por ser um molde da controller
 * data: 09/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/

const configmessages = require('../modulo/configMessages.js')
const algoDAO = require('')

const inserir =  async function (algo, contentType) {
     let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

     try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validar = await validarDados(algo)

            if(validar){
                return validar //400 
        }else{
             let resultado = await algoDAO.insert(await tratardados(algo))
                        if(resultado){
                            algo.id = resultado
            
                            modifiedmessage.DEFAULT_MESSAGE.status = modifiedmessage.SUCCESS_CREATED_ITEM.status
                            modifiedmessage.DEFAULT_MESSAGE.status_code = modifiedmessage.SUCCESS_CREATED_ITEM.status_code
                            modifiedmessage.DEFAULT_MESSAGE.message = modifiedmessage.SUCCESS_CREATED_ITEM.message
                            modifiedmessage.DEFAULT_MESSAGE.response = algo
            
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


const validarDados = async function(algo){

    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    if(algo == undefined || estado == null || algo == '' || algo.length > 3){

        modifiedmessage.ERROR_BAD_REQUEST.field = '[] invalido'
        return modifiedmessage.ERROR_BAD_REQUEST //400 bad request

    } else {
        return false
    }
}

const tratardados = async function(algo){
    algo        = algo.replaceAll("'", "")
    algo        = algo.replaceAll("'", "")

    return algo
}

module.exports={

}
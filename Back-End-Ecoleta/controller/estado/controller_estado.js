/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de email no banco de dados
 * data: 09/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/

const configmessages = require('../modulo/configMessages.js')
const estadoDAO = require('../../model/DAO/estado/estado.js')


const inserirEstado =  async function (estado, contentType) {
     let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

     try {

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validar = await validarDados(estado)

            if(validar){
                return validar //400 
            }else{
                let resultado = await estadoDAO.insertEstado(await tratardados(estado))
                        if(resultado){
                            estado.id = resultado
            
                            modifiedmessage.DEFAULT_MESSAGE.status      = modifiedmessage.SUCCESS_CREATED_ITEM.status
                            modifiedmessage.DEFAULT_MESSAGE.status_code = modifiedmessage.SUCCESS_CREATED_ITEM.status_code
                            modifiedmessage.DEFAULT_MESSAGE.message     = modifiedmessage.SUCCESS_CREATED_ITEM.message
                            modifiedmessage.DEFAULT_MESSAGE.response    = estado
                
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


const validarDados = async function(estado){

    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    if(estado.sigla == undefined || estado.sigla == null || estado.sigla == '' || estado.sigla.length > 3){

        modifiedmessage.ERROR_BAD_REQUEST.field = '[SIGLA] invalido'
        return modifiedmessage.ERROR_BAD_REQUEST //400 bad request

    } else if(estado.nome_estado == undefined || estado.nome_estado == null || estado.nome_estado == '' || estado.nome_estado.length > 30){

        modifiedmessage.ERROR_BAD_REQUEST.field = '[NOMDE DO ESTADO] invalido'
        return modifiedmessage.ERROR_BAD_REQUEST //400 bad request

    } else{
        return false
    }
}

const tratardados = async function(estado){
    estado.sigla         = estado.sigla.replaceAll("'", "")
    estado.nome_estado   = estado.nome_estado.replaceAll("'", "")

    return estado
}

module.exports={
    inserirEstado

}
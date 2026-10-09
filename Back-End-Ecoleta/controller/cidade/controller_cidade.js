/**************************************************************************************
 * objetivo: arquivo responsavel por ser um molde da controller
 * data: 09/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/

const configmessages = require('../modulo/configMessages.js')
const cidadeDAO = require('../../model/DAO/cidade/cidade.js')

const inserirCidade =  async function (cidade, contentType) {
     let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

     try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validar = await validarDados(cidade)

            if(validar){
                return validar //400 
        }else{
             let resultado = await cidadeDAO.insertCidade(await tratardados(cidade))
                        if(resultado){
                            cidade.id = resultado
            
                            modifiedmessage.DEFAULT_MESSAGE.status = modifiedmessage.SUCCESS_CREATED_ITEM.status
                            modifiedmessage.DEFAULT_MESSAGE.status_code = modifiedmessage.SUCCESS_CREATED_ITEM.status_code
                            modifiedmessage.DEFAULT_MESSAGE.message = modifiedmessage.SUCCESS_CREATED_ITEM.message
                            modifiedmessage.DEFAULT_MESSAGE.response = cidade
            
                            return modifiedmessage.DEFAULT_MESSAGE
                        }else{
                            return modifiedmessage.ERROR_INTERNAL_SERVER_MODEL //500 model
                        }
        }
        }else{
            return modifiedmessage.ERROR_CONTENT_TYPE //415 content type
        }
        
     } catch (error) {
        console.log(error)
        return modifiedmessage.ERROR_INTERNAL_SERVER_CONTROLLER //500 controller
     }
    
}


const validarDados = async function(cidade){

    let modifiedmessage = JSON.parse(JSON.stringify(configmessages))

    if(cidade.nome_cidade == undefined || cidade.nome_cidade == null || cidade.nome_cidade == '' || cidade.nome_cidade.length > 60){

        modifiedmessage.ERROR_BAD_REQUEST.field = '[NOME DA CIDADE] invalido'
        return modifiedmessage.ERROR_BAD_REQUEST //400 bad request

    } else if(cidade.id_estado == undefined || cidade.id_estado == null || isNaN(cidade.id_estado) || cidade.id_estado == '' || cidade.id_estado <= 0){

        modifiedmessage.ERROR_BAD_REQUEST.field = '[ID_ESTADO] invalido'
        return modifiedmessage.ERROR_BAD_REQUEST //400 bad request

    } else {
        return false
    }
}

const tratardados = async function(cidade){
    cidade.nome_cidade        = cidade.nome_cidade.replaceAll("'", "")
    cidade.id_estado          = cidade.id_estado.replaceAll("'", "")

    return cidade
}

module.exports = {
    inserirCidade
}
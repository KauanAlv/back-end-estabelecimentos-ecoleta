/*********************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas ao EMAIL
 * Data: 20/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
*********************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../../controller/modulo/configMessages.js')

// IMPORT DA DAO
const emailDAO = require('../../../model/DAO/cadastro_estabelecimento/email/email.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const emailSchema = require('../../../schema/email/schema_email.js')
const validarDados = require('../../../utils/validarDados.js')

// Função para validar os dados do e-mail
const validarDadosEmail = function (email) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(emailSchema, email, customMessages)
}

// Função para inserir um novo e-mail
const inserirEmailService = async function (email) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = validarDadosEmail(email)

        if (validacao) {
            return validacao
        }

        let result = await emailDAO.insertEmail(email)

        if (result) {
            email.id = result

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = email

            return customMessages.DEFAULT_MESSAGE // 201, item criado
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para atualizar um e-mail
const atualizarEmailService = async function (email, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarEmail = await buscarEmailService(id)

        if (resultBuscarEmail.status) {
            let validacao = validarDadosEmail(email)

            if (!validacao) {
                email.id = Number(id)

                let result = await emailDAO.updateEmail(email)

                if (result) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = email

                    return customMessages.DEFAULT_MESSAGE // 200 (atualizado)
                } else {
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
                }
            } else {
                return validacao
            }
        } else {
            return resultBuscarEmail // 400, 404 ou 500 da services/model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para listar um e-mail
const listarEmailService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await emailDAO.selectAllEmail()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.email = result

                return customMessages.DEFAULT_MESSAGE // 200
            } else {
                return customMessages.ERROR_NOT_FOUND // 404, não encontrado
            }

        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para buscar um e-mail
const buscarEmailService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacaoId = validarDados.validarId(id, customMessages)

        if (validacaoId) {
            return validacaoId
        }

        let result = await emailDAO.selectByIdEmail(id)

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.email = result

                return customMessages.DEFAULT_MESSAGE // 200
            } else {
                return customMessages.ERROR_NOT_FOUND // 404
            }
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

module.exports = {
    inserirEmailService,
    atualizarEmailService,
    listarEmailService,
    buscarEmailService
}
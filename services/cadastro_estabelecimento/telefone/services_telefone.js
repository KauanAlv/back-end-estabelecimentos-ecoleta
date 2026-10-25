/*********************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas ao TELEFONE
 * Data: 20/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
*********************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../../controller/modulo/configMessages.js')

// IMPORT DA DAO
const telefoneDAO = require('../../../model/DAO/cadastro_estabelecimento/telefone/telefone.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const telefoneSchema = require('../../../schema/telefone/schema_telefone.js')
const validarDados = require('../../../utils/validarDados.js')

// Função para validar os dados do telefone
const validarDadosTelefone = function (numero) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(telefoneSchema, numero, customMessages)
}

// Função para inserir um novo telefone
const inserirTelefoneService = async function (numero) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = validarDadosTelefone(numero)

        if (validacao) {
            return validacao
        }

        let result = await telefoneDAO.insertTelefone(numero)

        if (result) {
            numero.id = result

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = numero

            return customMessages.DEFAULT_MESSAGE // 201, item criado
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para atualizar um telefone
const atualizarTelefoneService = async function (numero, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarTelefone = await buscarTelefoneService(id)

        if (resultBuscarTelefone.status) {
            let validacao = validarDadosTelefone(numero)

            if (!validacao) {
                numero.id = Number(id)

                let result = await telefoneDAO.updateTelefone(numero)

                if (result) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = numero

                    return customMessages.DEFAULT_MESSAGE // 200 (atualizado)
                } else {
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
                }
            } else {
                return validacao
            }
        } else {
            return resultBuscarTelefone // 400, 404 ou 500 da services/model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para listar um telefone
const listarTelefoneService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await telefoneDAO.selectAllTelefone()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.numero = result

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

// Função para buscar um telefone
const buscarTelefoneService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacaoId = validarDados.validarId(id, customMessages)

        if (validacaoId) {
            return validacaoId
        }

        let result = await telefoneDAO.selectByIdTelefone(id)

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.numero = result

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
    inserirTelefoneService,
    atualizarTelefoneService,
    listarTelefoneService,
    buscarTelefoneService
}
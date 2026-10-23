/******************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas a CIDADE
 * Data: 20/10/2026 - (sábado)
 * Autor: Gabriel Renato
 * Versão: 1.0
*******************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../controller/modulo/configMessages.js')

// IMPORT DA DAO
const cidadeDAO = require('../../model/DAO/cidade/cidade.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const cidadeSchema = require('../../schema/cidade/schema_cidade.js')
const validarDados = require('../../utils/validarDados.js')

// Função para validar os dados da cidade
const validarDadosCidade = function (cidade) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(cidadeSchema, cidade, customMessages)
}

// Função para inserir uma nova cidade
const inserirCidadeService = async function (cidade) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = validarDadosCidade(cidade)

        if (validacao) {
            return validacao
        }

        let result = await cidadeDAO.insertOuSelectCidade(cidade)

        if (result) {
            cidade.id = result

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = cidade

            return customMessages.DEFAULT_MESSAGE // 201, item criado
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para atualizar uma cidade
const atualizarCidadeService = async function (cidade, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarCidade = await buscarCidadeService(id)

        if (resultBuscarCidade.status) {
            let validacao = validarDadosCidade(cidade)

            if (!validacao) {

                cidade.id = Number(id)

                let result = await cidadeDAO.updateCidade(cidade)

                if (result) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = cidade

                    return customMessages.DEFAULT_MESSAGE // 200 (atualizado)
                } else {
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
                }
            } else {
                return validacao
            }
        } else {
            return resultBuscarCidade // 400, 404 ou 500 da services/model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para listar as cidades
const listarCidadeService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await cidadeDAO.selectAllCidade()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.cidade = result

                return customMessages.DEFAULT_MESSAGE // 200
            } else {
                return customMessages.ERROR_NOT_FOUND // 404, não encontrado
            }

        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
        }

    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para buscar uma cidade
const buscarCidadeService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacaoId = validarDados.validarId(id, customMessages)

        if (validacaoId) {
            return validacaoId
        }

        let result = await cidadeDAO.selectByIdCidade(id)

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.cidade = result

                return customMessages.DEFAULT_MESSAGE
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
    inserirCidadeService,
    atualizarCidadeService,
    listarCidadeService,
    buscarCidadeService
}
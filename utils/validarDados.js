/*************************************************************************
 * Objetivo: Arquivo responsável pela padronização da validação dos dados
 * Data: 20/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
 *************************************************************************/

// IMPORT DO SCHEMA DE VALIDAÇÃO
const idSchema = require('../schema/id/schema_id.js')

// Função para validar os dados gerais
const validarDadosGeral = function (schema, dados, customMessages) {
    const { error } = schema.validate(dados, { abortEarly: false })

    if (error) {
        let mensagensDeErro = []

        for (let detalhes of error.details) {
            mensagensDeErro.push(detalhes.message)
        }

        customMessages.ERROR_BAD_REQUEST.field = mensagensDeErro // 400, validação incorreta
        return customMessages.ERROR_BAD_REQUEST
    }

    return false
}

// Função para validar o id
const validarId = function (id, customMessages) {
    const { error } = idSchema.validate({ id: id }, { abortEarly: false })

    if (error) {
        let mensagensDeErro = []

        for (let detalhes of error.details) {
            mensagensDeErro.push(detalhes.message)
        }

        customMessages.ERROR_BAD_REQUEST.field = mensagensDeErro // 400, validação incorreta
        return customMessages.ERROR_BAD_REQUEST
    }

    return false
}

module.exports = {
    validarDadosGeral,
    validarId
}
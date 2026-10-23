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

// Função para verificar o dígito do CNPJ
function calcularDigitoVerificador(cnpj, pesos) {
    let soma = 0

    for (let i = 0; i < pesos.length; i++) {
        let valor = cnpj.charCodeAt(i) - 48
        soma = soma + valor * pesos[i]
    }

    let resto = soma % 11

    if (resto < 2) {
        return 0
    }

    return 11 - resto
}

// Função para validar os dígitos do CNPJ
function validarCNPJ(cnpj) {
    if (typeof cnpj !== 'string') {
        return false
    }

    cnpj = cnpj.trim().toUpperCase()

    // Permite somente letras, números e a pontuação usual do CNPJ.
    if (!/^[A-Z0-9./-]+$/.test(cnpj)) {
        return false
    }

    // Remove a pontuação do CNPJ.
    cnpj = cnpj.replace(/[./-]/g, '')

    // O CNPJ possui 14 posições.
    // As 12 primeiras podem conter letras e números.
    // As 2 últimas devem ser numéricas.
    if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) {
        return false
    }

    const pesosPrimeiroDigito = [
        5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
    ]

    const pesosSegundoDigito = [
        6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
    ]

    const baseCNPJ = cnpj.substring(0, 12)

    const primeiroDigito = calcularDigitoVerificador(
        baseCNPJ,
        pesosPrimeiroDigito
    )

    const cnpjComPrimeiroDigito = baseCNPJ + primeiroDigito

    const segundoDigito = calcularDigitoVerificador(
        cnpjComPrimeiroDigito,
        pesosSegundoDigito
    )

    const digitosVerificadores = cnpj.substring(12)

    return digitosVerificadores === String(primeiroDigito) + String(segundoDigito)
}

module.exports = {
    validarDadosGeral,
    validarId,
    validarCNPJ
}
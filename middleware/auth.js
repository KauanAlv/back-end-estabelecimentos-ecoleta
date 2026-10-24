/******************************************************************************
 * Objetivo: Arquivo responsável por proteger as rotas que exigem autenticação
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
******************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../controller/modulo/configMessages.js')

// IMPORT DAS FUNÇÕES DO JWT
const jwt = require('./middlewareJWT.js')

// Verifica a autenticação da requisição
const verifyToken = function (request, response, next) {
    // Obtém o token do cabeçalho
    let authorization = request.headers.authorization

    // Verifica se o token foi informado
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return response
            .status(configMessages.ERROR_INVALID_TOKEN.status_code)
            .json(configMessages.ERROR_INVALID_TOKEN)
    }

    // .slice(7) remove os primeiros 7 caracteres do cabeçalho ("Bearer ")
    let token = authorization.slice(7)

    // Valida o token recebido
    let autenticidadeToken = jwt.validateJWT(token)

    // Verifica o token e o ID da empresa
    if (!autenticidadeToken || !Number.isInteger(autenticidadeToken.id_estabelecimento) || autenticidadeToken.id_estabelecimento < 1) {
        return response
            .status(configMessages.ERROR_INVALID_TOKEN.status_code)
            .json(configMessages.ERROR_INVALID_TOKEN)
    }

    // Disponibiliza o ID da empresa autenticada
    request.id_estabelecimento = autenticidadeToken.id_estabelecimento

    // Permite continuar a requisição
    next()
}

module.exports = {
    verifyToken
}
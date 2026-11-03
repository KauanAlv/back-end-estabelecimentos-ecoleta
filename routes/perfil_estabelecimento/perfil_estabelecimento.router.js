/****************************************************************
 * Objetivo: Arquivo responsável por conter os métodos das rotas
 * Data: 03/11/2026 - (terça-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
****************************************************************/

const express = require('express')        // Import do express
const bodyParser = require('body-parser') // Import do bodyParser

const bodyParserJSON = bodyParser.json()  // Permitindo a utilização do JSON no body das requisições

const router = express.Router()           // Cria um objeto de rota para os Endpoints

// IMPORT DA CONTROLLER
const controllerPerfilEstabelecimento = require('../../controller/perfil_estabelecimento/controller_perfil_estabelecimento.js')

// IMPORT DO MIDDLEWARE DE AUTENTICAÇÃO
const auth = require('../../middleware/auth.js')

// ================= ENDPOINTS ====================
// Busca os dados do perfil do estabelecimento autenticado
router.get('/', auth.verifyToken, async function (request, response) {

    let idEstabelecimento = request.id_estabelecimento

    // Consulta os dados do perfil do estabelecimento
    let result = await controllerPerfilEstabelecimento.buscarPerfilEstabelecimento(idEstabelecimento)

    response.status(result.status_code)
    response.json(result)
})

// Atualiza os dados do perfil do estabelecimento autenticado
router.put('/', auth.verifyToken, bodyParserJSON, async function (request, response) {

    let idEstabelecimento = request.id_estabelecimento

    let dados = request.body

    let contentType = request.headers['content-type']

    // Atualiza os dados do perfil do estabelecimento
    let result = await controllerPerfilEstabelecimento.atualizarPerfilEstabelecimento(
        dados,
        idEstabelecimento,
        contentType
    )

    response.status(result.status_code)
    response.json(result)
})

// Altera a senha do estabelecimento autenticado
router.patch('/senha', auth.verifyToken, bodyParserJSON, async function (request, response) {

    let idEstabelecimento = request.id_estabelecimento

    let dados = request.body

    let contentType = request.headers['content-type']

    // Altera a senha do estabelecimento
    let result = await controllerPerfilEstabelecimento.alterarSenhaEstabelecimento(
        dados,
        idEstabelecimento,
        contentType
    )

    response.status(result.status_code)
    response.json(result)
})

module.exports = router
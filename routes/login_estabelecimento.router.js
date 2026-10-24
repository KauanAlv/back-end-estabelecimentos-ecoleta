/****************************************************************
 * Objetivo: Arquivo responsável por conter os métodos das rotas
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
****************************************************************/

const express = require('express')        //Import do express
const bodyParser = require('body-parser') //Import do bodyParser

const bodyParserJSON = bodyParser.json()  //Permitindo a utilização do JSON no body das requisições

const router = express.Router()           //Cria um objeto de rota para os Endpoints

const controllerLoginEstabelecimento = require('../controller/login_estabelecimento/controller_login_estabelecimento.js')

// ================= ENDPOINTS ====================
router.post('/', bodyParserJSON, async function (request, response) {

    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerLoginEstabelecimento.loginEstabelecimento(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router
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

const controllerCadastroEstabelecimento = require('../controller/cadastro_estabelecimento/controller_cadastro_estabelecimento.js')

// ================= ENDPOINTS ====================
router.post('/', bodyParserJSON, async function (request, response) {

    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerCadastroEstabelecimento.cadastrarEstabelecimento(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router
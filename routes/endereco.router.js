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

const controllerEndereco = require('../controller/cadastro_estabelecimento/endereco/controller_endereco.js')

// ================= ENDPOINTS ====================
router.post('/', bodyParserJSON, async function (request, response) {

    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerEndereco.inserirNovaEndereco(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {

    let result = await controllerEndereco.listarEndereco()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {

    let id = request.params.id
    let result = await controllerEndereco.buscarEndereco(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {

    let contentType = request.headers['content-type']

    let id = request.params.id

    let dados = request.body

    let result = await controllerEndereco.atualizarEndereco(dados, id, contentType)
    response.status(result.status_code)
    response.json(result)
})

module.exports = router
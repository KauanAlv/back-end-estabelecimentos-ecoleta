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

const controllerEstado = require('../controller/cadastro_estabelecimento/estado/controller_estado.js')

// ================= ENDPOINTS ====================
router.post('/', bodyParserJSON, async function (request, response) {

    let dados = request.body

    let contentType = request.headers['content-type']

    let result = await controllerEstado.inserirNovoEstado(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {

    let result = await controllerEstado.listarEstado()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {

    let id = request.params.id
    let result = await controllerEstado.buscarEstado(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {

    let contentType = request.headers['content-type']

    let id = request.params.id

    let dados = request.body

    let result = await controllerEstado.atualizarEstado(dados, id, contentType)
    response.status(result.status_code)
    response.json(result)
})

module.exports = router
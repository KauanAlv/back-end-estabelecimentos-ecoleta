/****************************************************************
 * Objetivo: Arquivo responsável por conter os métodos das rotas
 * Data: 30/10/2026 - (quinta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
****************************************************************/

const express = require('express') // Import do express
const bodyParser = require('body-parser') //Import do bodyParser

const bodyParserJSON = bodyParser.json()  //Permitindo a utilização do JSON no body das requisições

const router = express.Router() // Cria um objeto de rota para os Endpoints

// IMPORT DA CONTROLLER
const controllerOfertas = require('../../controller/ofertas_estabelecimento/controller_ofertas_estabelecimento.js')

// IMPORT DO MIDDLEWARE DE AUTENTICAÇÃO
const auth = require('../../middleware/auth.js')

// ================= ENDPOINTS ====================
// Aceitar uma oferta recebida pelo estabelecimento
router.post('/:id_oferta/aceitar', auth.verifyToken, bodyParserJSON, async function (request, response) {

    let dados = request.body

    let contentType = request.headers['content-type']

    // Obtém o ID da oferta inicial pela rota
    let idOfertaInicial = request.params.id_oferta

    // Obtém o ID do estabelecimento autenticado pelo JWT
    let idEstabelecimento = request.id_estabelecimento

    let result = await controllerOfertas.aceitarOferta(dados, contentType, idEstabelecimento, idOfertaInicial)

    response.status(result.status_code)
    response.json(result)
})

// Recusar uma oferta recebida pelo estabelecimento
// PATCH: altera o status da oferta, inserindo um novo registro no histórico
router.patch('/:id_oferta/recusar', auth.verifyToken, async function (request, response) {

    // Obtém o ID da oferta inicial pela rota
    let idOfertaInicial = request.params.id_oferta

    // Obtém o ID do estabelecimento autenticado pelo JWT
    let idEstabelecimento = request.id_estabelecimento

    let result = await controllerOfertas.recusarOferta(idOfertaInicial, idEstabelecimento)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router
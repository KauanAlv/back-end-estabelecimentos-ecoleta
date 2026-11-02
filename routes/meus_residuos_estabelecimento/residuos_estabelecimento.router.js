/****************************************************************
 * Objetivo: Arquivo responsável por conter os métodos das rotas
 * Data: 29/10/2026 - (quinta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
****************************************************************/

const express = require('express') // Import do express
const bodyParser = require('body-parser') //Import do bodyParser

const bodyParserJSON = bodyParser.json()  //Permitindo a utilização do JSON no body das requisições

const router = express.Router() // Cria um objeto de rota para os Endpoints

// IMPORT DA CONTROLLER
const controllerResiduo = require('../../controller/residuos/controller_residuos_estabelecimento.js')

// IMPORT DO MIDDLEWARE DE AUTENTICAÇÃO
const auth = require('../../middleware/auth.js')

// ================= ENDPOINTS ====================
// Cadastrar um novo resíduo
router.post('/', auth.verifyToken, bodyParserJSON, async function (request, response) {

    let dados = request.body

    let contentType = request.headers['content-type']

    // Obtém o ID do estabelecimento autenticado pelo JWT
    let idEstabelecimento = request.id_estabelecimento

    let result = await controllerResiduo.cadastrarResiduo(dados, contentType, idEstabelecimento)

    response.status(result.status_code)
    response.json(result)
})

// Atualizar um resíduo
router.put('/:id_residuo', auth.verifyToken, bodyParserJSON, async function (request, response) {

    let contentType = request.headers['content-type']

    // Obtém o ID do resíduo pela rota
    let idResiduo = request.params.id_residuo

    let dados = request.body

    // Obtém o ID do estabelecimento autenticado pelo JWT
    let idEstabelecimento = request.id_estabelecimento

    let result = await controllerResiduo.atualizarResiduo(dados, contentType, idEstabelecimento, idResiduo)

    response.status(result.status_code)
    response.json(result)
})

// Cancelar um resíduo
// PATCH: altera o status do resíduo, inserindo um novo registro no histórico
router.patch('/:id_residuo/cancelar', auth.verifyToken, async function (request, response) {

    // Obtém o ID do resíduo pela rota
    let idResiduo = request.params.id_residuo

    // Obtém o ID do estabelecimento autenticado pelo JWT
    let idEstabelecimento = request.id_estabelecimento

    let result = await controllerResiduo.cancelarResiduo(idResiduo, idEstabelecimento)

    response.status(result.status_code)
    response.json(result)
})


module.exports = router
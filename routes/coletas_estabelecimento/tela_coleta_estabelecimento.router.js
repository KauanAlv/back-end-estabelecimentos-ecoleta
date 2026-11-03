/****************************************************************
 * Objetivo: Arquivo responsável por conter os métodos das rotas
 * Data: 03/11/2026 - (sexta-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
****************************************************************/

const express = require('express') // Import do express

const router = express.Router() // Cria um objeto de rota para os Endpoints

const controllerTelaColetastabelecimento = require('../../controller/coletas_estabelecimento/tela_coletas_estabelecimento/controller_tela_coletas_estabelecimento.js')

// IMPORT DO MIDDLEWARE DE AUTENTICAÇÃO
const auth = require('../../middleware/auth.js')

// ================= ENDPOINTS ====================
router.get('/', auth.verifyToken, async function (request, response) {

    // Obtém o ID da empresa autenticada pelo JWT
    let idEstabelecimento = request.id_estabelecimento

    // Consulta os dados da tela de coleta 
    let result = await controllerTelaColetastabelecimento.listarColetasEstabelecimento(idEstabelecimento)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id_oferta_inicial', auth.verifyToken, async function (request, response) {

    // Obtém o ID da empresa autenticada pelo JWT
    let idEstabelecimento = request.id_estabelecimento

    // Obtém o ID do resíduo da URL
    let idOfertaInicial = request.params.id_oferta_inicial

    // Consulta os dados de uma coleta
    let result = await controllerTelaColetastabelecimento.buscarColetasEstabelecimento(idEstabelecimento, idOfertaInicial)

    response.status(result.status_code)
    response.json(result)
})


module.exports = router
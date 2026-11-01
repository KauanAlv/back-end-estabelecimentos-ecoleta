/****************************************************************
 * Objetivo: Arquivo responsável por conter os métodos das rotas
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
****************************************************************/

const express = require('express') // Import do express

const router = express.Router() // Cria um objeto de rota para os Endpoints

const controllerHistoricoEstabelecimento = require('../../controller/historico_estabelecimento/controller_historico_estabelecimento.js')

// IMPORT DO MIDDLEWARE DE AUTENTICAÇÃO
const auth = require('../../middleware/auth.js')

// ================= ENDPOINTS ====================
router.get('/', auth.verifyToken, async function (request, response) {

    // Obtém o ID da empresa autenticada pelo JWT
    let idEstabelecimento = request.id_estabelecimento

    // Consulta os dados da Home
    let result = await controllerHistoricoEstabelecimento.buscarHistoricoEstabelecimento(idEstabelecimento)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router
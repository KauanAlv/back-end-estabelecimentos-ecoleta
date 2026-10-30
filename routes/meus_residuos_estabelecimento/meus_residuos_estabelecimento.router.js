/****************************************************************
 * Objetivo: Arquivo responsável por conter os métodos das rotas
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
****************************************************************/

const express = require('express') // Import do express

const router = express.Router() // Cria um objeto de rota para os Endpoints

const controllerMeusResiduos = require('../../controller/meus_residuos/controller_meus_residuos.js')

// IMPORT DO MIDDLEWARE DE AUTENTICAÇÃO
const auth = require('../../middleware/auth.js')

// ================= ENDPOINTS ====================
router.get('/', auth.verifyToken, async function (request, response) {

    // Obtém o ID da empresa autenticada pelo JWT
    let idEstabelecimento = request.id_estabelecimento

    // Consulta os dados da Home
    let result = await controllerMeusResiduos.buscarMeusResiduosEstabelecimento(idEstabelecimento)

    response.status(result.status_code)
    response.json(result)
})


router.get('/:id', auth.verifyToken, async function (request, response) {

    let idResiduo = request.params.id
    // Obtém o ID da empresa autenticada pelo JWT
    let idEstabelecimento = request.id_estabelecimento

    // Consulta os dados da Home
    let result = await controllerMeusResiduos.buscarMeuResiduoDisponivelById(idEstabelecimento, idResiduo)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router
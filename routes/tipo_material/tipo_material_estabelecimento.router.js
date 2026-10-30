/****************************************************************
 * Objetivo: Arquivo responsável por conter os métodos das rotas
 * Data: 28/10/2026 - (quarta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
****************************************************************/

const express = require('express')        //Import do express

const router = express.Router()           //Cria um objeto de rota para os Endpoints

const controllerTipoMaterial = require('../../controller/tipo_material/controller_tipo_material.js')

// ================= ENDPOINTS ====================
router.get('/', async function (request, response) {

    let result = await controllerTipoMaterial.listarTipoMaterial()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {

    let id = request.params.id
    let result = await controllerTipoMaterial.buscarTipoMaterial(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router
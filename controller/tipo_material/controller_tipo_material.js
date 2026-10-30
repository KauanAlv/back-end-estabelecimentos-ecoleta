/*****************************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas ao TIPO DO MATERIAL e retornar as respostas da API
 * Data: 28/10/2026 - (quarta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
*****************************************************************************************************************************/

const configMessages = require('../modulo/configMessages.js')

// IMPORT DA SERVICE
const tipoMaterialService = require('../../services/tabelas_auxiliares/tipo_material/services_tipo_material.js')

// Listar os tipos de materiais
const listarTipoMaterial = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await tipoMaterialService.listarTiposMateriaisService()

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Buscar um tipo de material
const buscarTipoMaterial = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await tipoMaterialService.buscarTipoMaterialService(id)

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    listarTipoMaterial,
    buscarTipoMaterial
}
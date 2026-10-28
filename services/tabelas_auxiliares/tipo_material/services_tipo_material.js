/**************************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas ao TIPO DO MATERIAL do RESÍDUO
 * Data: 28/10/2026 - (quarta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
**************************************************************************************************************/

const configMessages = require('../../../controller/modulo/configMessages.js')

// IMPORT DA DAO
const tipoMaterialDAO = require('../../../model/DAO/tabelas_auxiliares/tipo_material/tipo_material.js')

// IMPORT DA FUNÇÃO DE VALIDAÇÃO
const validarDados = require('../../../utils/validarDados.js')

// Lista todos os tipos de materiais
const listarTiposMateriaisService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await tipoMaterialDAO.selectAllTipoMaterial()

        if (result === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        if (result.length === 0)
            return customMessages.ERROR_NOT_FOUND // 404, nenhum material encontrado

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_RESPONSE.message
        customMessages.DEFAULT_MESSAGE.response = result

        return customMessages.DEFAULT_MESSAGE // 200, consulta realizada

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Busca um tipo de material pelo ID
const buscarTipoMaterialService = async function (idTipoMaterial) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validarId = validarDados.validarId(idTipoMaterial, customMessages)

        if (validarId)
            return validarId

        let result = await tipoMaterialDAO.selectByIdTipoMaterial(idTipoMaterial)

        if (result === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        if (result.length === 0)
            return customMessages.ERROR_NOT_FOUND // 404, material não encontrado

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_RESPONSE.message
        customMessages.DEFAULT_MESSAGE.response = result[0]

        return customMessages.DEFAULT_MESSAGE // 200, consulta realizada

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

module.exports = {
    listarTiposMateriaisService,
    buscarTipoMaterialService
}
/****************************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas ao ESTABELECIMENTO e retornar as respostas da API
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
 ****************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../modulo/configMessages.js')

// IMPORT DA SERVICE
const estabelecimentoService = require('../../../services/cadastro_empresa_coletora/empresa_coletora/services_empresa_coletora.js')

// Inserir um novo estabelecimento
const inserirNovoEstabelecimento = async function (estabelecimento, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await estabelecimentoService.inserirEstabelecimentoService(estabelecimento)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Atualizar um estabelecimento
const atualizarEstabelecimento = async function (estabelecimento, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let result = await estabelecimentoService.atualizarEstabelecimentoService(estabelecimento, id)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Listar um estabelecimento
const listarEstabelecimento = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await estabelecimentoService.listarEstabelecimentoService()

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Buscar um estabelecimento
const buscarEstabelecimento = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await estabelecimentoService.buscarEstabelecimentoService(id)

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoEstabelecimento,
    atualizarEstabelecimento,
    listarEstabelecimento,
    buscarEstabelecimento
}
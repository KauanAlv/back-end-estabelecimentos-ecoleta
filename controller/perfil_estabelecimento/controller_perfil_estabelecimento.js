/*****************************************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas ao PERFIL DO ESTABELECIMENTO e retornar as respostas da API
 * Data: 03/11/2026 - (terça-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
*****************************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../modulo/configMessages.js')

// IMPORT DA SERVICE
const perfilEstabelecimentoService = require('../../services/perfil_estabelecimento/services_perfil_estabelecimento.js')

// Função para buscar os dados do perfil do estabelecimento
const buscarPerfilEstabelecimento = async function (idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await perfilEstabelecimentoService.buscarPerfilEstabelecimentoService(idEstabelecimento)

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Função para atualizar os dados do perfil do estabelecimento
const atualizarPerfilEstabelecimento = async function (estabelecimento, idEstabelecimento, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await perfilEstabelecimentoService.atualizarPerfilEstabelecimentoService(estabelecimento, idEstabelecimento)

            return result

        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Função para alterar a senha do estabelecimento
const alterarSenhaEstabelecimento = async function (dadosSenha, idEstabelecimento, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await perfilEstabelecimentoService.alterarSenhaEstabelecimentoService(dadosSenha, idEstabelecimento)

            return result

        } else {
            return customMessages.ERROR_CONTENT_TYPE // 415, não é um JSON
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

module.exports = {
    buscarPerfilEstabelecimento,
    atualizarPerfilEstabelecimento,
    alterarSenhaEstabelecimento
}
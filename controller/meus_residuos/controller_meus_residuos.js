/************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável por controlar as requisições relacionadas a TELA DE RESÍDUOS DISPONÍVEIS DA EMPRESA COLETORA e retornar as respostas da API
 * Data: 26/10/2026 - (segunda_feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
************************************************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../modulo/configMessages.js')

// IMPORT DA SERVICE
const meusResiduosService = require('../../services/meus_residuos/services_meus_residuos.js')

// Busca todos os resíduos visíveis para a empresa coletora
const buscarMeusResiduosEstabelecimento = async function (idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await meusResiduosService.buscarMeusResiduosEstabelecimento(idEstabelecimento)

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}

// Busca os detalhes de um resíduo disponível
const buscarMeuResiduoDisponivelById = async function (idEstabelecimento, idResiduo) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await meusResiduosService.buscarMeuResiduoDisponivelById(idEstabelecimento, idResiduo)

        return result

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER // 500, na controller
    }
}



module.exports = {
    buscarMeusResiduosEstabelecimento,
    buscarMeuResiduoDisponivelById
}
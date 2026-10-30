/***************************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas a TELA HOME DO ESTABELECIMENTO
 * Data: 22/10/2026 - (quinta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
***************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../controller/modulo/configMessages.js')

// IMPORT DA DAO
const homeEstabelecimentoDAO = require('../../model/DAO/home_estabelecimento/home_estabelecimento.js')

// Função para formatar a data no padrão brasileiro
const formatarData = function (data) {
    if (!data)
        return null

    return new Date(data).toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
    })
}

// Busca os dados da Home da empresa coletora
const buscarHomeEmpresaColetoraService = async function (idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultResumo = await homeEstabelecimentoDAO.selectResumoHomeEstabelecimento(idEstabelecimento)

        if (resultResumo === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        // Verifica se a empresa foi encontrada
        if (resultResumo.length === 0)
            return customMessages.ERROR_NOT_FOUND // 404, empresa não encontrada

        let resultOfertas = await homeEstabelecimentoDAO.selectOfertasHomeEstabelecimento(idEstabelecimento)

        if (resultOfertas === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        // Formata a data disponível das ofertas
        for (let oferta of resultOfertas) {
            oferta.data_disponivel = formatarData(oferta.data_disponivel)
        }

        // Prepara a resposta
        let resposta = {
            resumo: resultResumo[0],
            ofertas: resultOfertas
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_RESPONSE.message
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE // 200, consulta realizada

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

module.exports = {
    buscarHomeEmpresaColetoraService
}
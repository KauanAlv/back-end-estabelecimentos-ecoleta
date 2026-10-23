/******************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas ao ENDEREÇO
 * Data: 20/10/2026 - (terça-feira)
 * Autor: GAbriel Renato
 * Versão: 1.0
*******************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../controller/modulo/configMessages.js')

// IMPORT DA DAO
const enderecoDAO = require('../../model/DAO/endereco/endereco.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const enderecoSchema = require('../../schema/endereco/schema_endereco.js')
const validarDados = require('../../utils/validarDados.js')

// IMPORT DA FUNÇÃO DE GEOLOCALIZAÇÃO
const geolocalizacao = require('../../utils/geolocalizacao.js')

// Função para validar os dados da endereco
const validarDadosEndereco = function (endereco) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(enderecoSchema, endereco, customMessages)
}

// Função para inserir uma nova endereco
const inserirEnderecoService = async function (endereco) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = validarDadosEndereco(endereco)

        if (validacao) {
            return validacao
        }

        // Busca as coordenadas do endereço
        let coordenadas = await geolocalizacao.buscarCoordenadasEndereco(endereco)

        // Adiciona as coordenadas ao OBJETO do endereço
        endereco.latitude = coordenadas.latitude
        endereco.longitude = coordenadas.longitude

        let result = await enderecoDAO.insertEndereco(endereco)

        if (result) {
            endereco.id = result

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = endereco

            return customMessages.DEFAULT_MESSAGE // 201, item criado
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para atualizar uma endereco
const atualizarEnderecoService = async function (endereco, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarEndereco = await buscarEnderecoService(id)

        if (resultBuscarEndereco.status) {
            let validacao = validarDadosEndereco(endereco)

            if (validacao) {
                return validacao
            }

            // Busca as coordenadas do endereço atualizado
            let coordenadas = await geolocalizacao.buscarCoordenadasEndereco(endereco)

            // Adiciona as coordenadas ao objeto do endereço
            endereco.latitude = coordenadas.latitude
            endereco.longitude = coordenadas.longitude

            endereco.id = Number(id)

            let result = await enderecoDAO.updateEndereco(endereco)

            if (result) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATED_ITEM.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATED_ITEM.status_code
                customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATED_ITEM.message
                customMessages.DEFAULT_MESSAGE.response = endereco

                return customMessages.DEFAULT_MESSAGE // 200 (atualizado)
            } else {
                return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
            }

        } else {
            return resultBuscarEndereco // 400, 404 ou 500 da services/model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para listar as enderecos
const listarEnderecoService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await enderecoDAO.selectAllEndereco()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.endereco = result

                return customMessages.DEFAULT_MESSAGE // 200
            } else {
                return customMessages.ERROR_NOT_FOUND // 404, não encontrado
            }

        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para buscar uma endereco
const buscarEnderecoService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacaoId = validarDados.validarId(id, customMessages)

        if (validacaoId) {
            return validacaoId
        }

        let result = await enderecoDAO.selectByIdEndereco(id)

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.endereco = result

                return customMessages.DEFAULT_MESSAGE
            } else {
                return customMessages.ERROR_NOT_FOUND // 404
            }
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

module.exports = {
    inserirEnderecoService,
    atualizarEnderecoService,
    listarEnderecoService,
    buscarEnderecoService
}
/******************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas ao ESTADO
 * Data: 20/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
*******************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../../controller/modulo/configMessages.js')

// IMPORT DA DAO
const estadoDAO = require('../../../model/DAO/cadastro_estabelecimento/estado//estado.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const estadoSchema = require('../../../schema/estado/schema_estado.js')
const validarDados = require('../../../utils/validarDados.js')

// Função para validar os dados do estado
const validarDadosEstado = function (estado) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(estadoSchema, estado, customMessages)
}

// Função para inserir um novo estado
const inserirEstadoService = async function (estado) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = validarDadosEstado(estado)

        if (validacao) {
            return validacao
        }

        if (estado && estado.sigla) {
            estado.sigla = estado.sigla.toUpperCase().trim()
        }

        let result = await estadoDAO.insertOuSelectEstado(estado)

        if (result) {
            estado.id = result

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = estado

            return customMessages.DEFAULT_MESSAGE // 201, item criado
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para atualizar um estado
const atualizarEstadoService = async function (estado, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarEstado = await buscarEstadoService(id)

        if (resultBuscarEstado.status) {
            let validacao = validarDadosEstado(estado)

            if (!validacao) {

                if (estado && estado.sigla) {
                    estado.sigla = estado.sigla.toUpperCase().trim()
                }

                estado.id = Number(id)

                let result = await estadoDAO.updateEstado(estado)

                if (result) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = estado

                    return customMessages.DEFAULT_MESSAGE // 200 (atualizado)
                } else {
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
                }
            } else {
                return validacao
            }
        } else {
            return resultBuscarEstado // 400, 404 ou 500 da services/model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para listar um estado
const listarEstadoService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await estadoDAO.selectAllEstado()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.estado = result

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

// Função para buscar um estado
const buscarEstadoService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacaoId = validarDados.validarId(id, customMessages)

        if (validacaoId) {
            return validacaoId
        }

        let result = await estadoDAO.selectByIdEstado(id)

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.estado = result

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
    inserirEstadoService,
    atualizarEstadoService,
    listarEstadoService,
    buscarEstadoService
}
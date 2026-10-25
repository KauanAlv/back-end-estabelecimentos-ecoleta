/***************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas ao ESTABELECIMENTO
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
***************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../../controller/modulo/configMessages.js')

// IMPORT DA DAO
const estabelecimentoDAO = require('../../../model/DAO/cadastro_estabelecimento/estabelecimento/estabelecimento.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const estabelecimentoSchema = require('../../../schema/estabelecimento/schema_estabelecimento.js')
const validarDados = require('../../../utils/validarDados.js')

// Função para validar os dados do estabelecimento
const validarDadosEstabelecimento = function (estabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(estabelecimentoSchema, estabelecimento, customMessages)
}

// Função para inserir um novo estabelecimento
const inserirEstabelecimentoService = async function (estabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = validarDadosEstabelecimento(estabelecimento)

        if (validacao) {
            return validacao
        }

        let novoEstabelecimento = {
            nome: estabelecimento.nome,
            cnpj: estabelecimento.cnpj,
            senha_hash: estabelecimento.senha, // substituir pela criptografia
            id_email: estabelecimento.id_email,
            id_telefone: estabelecimento.id_telefone,
            id_endereco: estabelecimento.id_endereco
        }

        let result = await estabelecimentoDAO.insertEstabelecimento(novoEstabelecimento)

        if (result) {
            estabelecimento.id = result

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = {
                id: result,
                nome: novoEstabelecimento.nome,
                cnpj: novoEstabelecimento.cnpj,
                id_email: novoEstabelecimento.id_email,
                id_telefone: novoEstabelecimento.id_telefone,
                id_endereco: novoEstabelecimento.id_endereco
            }

            return customMessages.DEFAULT_MESSAGE // 201, item criado
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para atualizar um estabelecimento
const atualizarEstabelecimentoService = async function (estabelecimento, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarEstabelecimento = await buscarEstabelecimentoService(id)

        if (resultBuscarEstabelecimento.status) {
            let validacao = validarDadosEstabelecimento(estabelecimento)

            if (!validacao) {
                estabelecimento.id = Number(id)

                let estabelecimentoAtualizado = {
                    nome: estabelecimento.nome,
                    cnpj: estabelecimento.cnpj,
                    senha_hash: estabelecimento.senha, // substituir pela criptografia
                    id_email: estabelecimento.id_email,
                    id_telefone: estabelecimento.id_telefone,
                    id_endereco: estabelecimento.id_endereco,
                    id: Number(id)
                }

                let result = await estabelecimentoDAO.updateEstabelecimento(estabelecimentoAtualizado)

                if (result) {
                    customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response = estabelecimento

                    return customMessages.DEFAULT_MESSAGE // 200 (atualizado)
                } else {
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500 na model
                }
            } else {
                return validacao
            }
        } else {
            return resultBuscarEstabelecimento // 400, 404 ou 500 da services/model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para listar os estabelecimentos
const listarEstabelecimentoService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await estabelecimentoDAO.selectAllEstabelecimento()

        if (result) {

            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.estabelecimento = result

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

// Função para buscar um estabelecimento
const buscarEstabelecimentoService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacaoId = validarDados.validarId(id, customMessages)

        if (validacaoId) {
            return validacaoId
        }

        let result = await estabelecimentoDAO.selectByIdEstabelecimento(id)

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.estabelecimento = result

                return customMessages.DEFAULT_MESSAGE // 200
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
    inserirEstabelecimentoService,
    atualizarEstabelecimentoService,
    listarEstabelecimentoService,
    buscarEstabelecimentoService
}
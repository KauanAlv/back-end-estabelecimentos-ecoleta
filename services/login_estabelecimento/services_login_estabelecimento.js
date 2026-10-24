/************************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas ao LOGIN DO ESTABELECIMENTO
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../controller/modulo/configMessages.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const loginEstabelecimentoSchema = require('../../schema/login_estabelecimento/schema_login_estabelecimento.js')
const validarDados = require('../../utils/validarDados.js')

// IMPORT DA BIBLIOTECA PARA COMPARAR A SENHA
const bcrypt = require('bcrypt')

// IMPORT DO JWT
const jwt = require('../../middleware/middlewareJWT.js')

// IMPORT DA DAO
const estabelecimentoDAO = require('../../model/DAO/cadastro_estabelecimento/estabelecimento/estabelecimento.js')

// Função para validar os dados do login do estabelecimento
const validarDadosLoginEstabelecimento = function (dadosLogin) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(loginEstabelecimentoSchema, dadosLogin, customMessages)
}

// Função para realizar o login do estabelecimento
const loginEstabelecimentoService = async function (dadosLogin) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacao = validarDadosLoginEstabelecimento(dadosLogin)

        if (validacao) {
            return validacao
        }

        // Normaliza o CNPJ
        dadosLogin.cnpj = dadosLogin.cnpj.trim().toUpperCase()

        // Busca a empresa pelo CNPJ
        let resultado = await estabelecimentoDAO.selectEstabelecimentoByCnpj(dadosLogin.cnpj)

        if (resultado === false)
            return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na Services

        if (resultado.length === 0)
            return customMessages.ERROR_UNAUTHORIZED // 401, credenciais inválidas

        // Obtém os dados da empresa
        let estabelecimento = resultado[0]

        // Compara a senha com o hash armazenado
        let senhaValida = await bcrypt.compare(dadosLogin.senha, estabelecimento.senha_hash)

        if (!senhaValida)
            return customMessages.ERROR_UNAUTHORIZED // 401, credenciais inválidas

        // Gera o token JWT
        let token = jwt.createJWT(estabelecimento.id_estabelecimento)

        // Prepara a resposta
        let resposta = {
            id: estabelecimento.id_estabelecimento,
            nome_empresa: estabelecimento.nome,
            cnpj: estabelecimento.cnpj,
            token: token
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = 'Login realizado com sucesso.'
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE // 200, login realizado

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na Services
    }
}

module.exports = {
    loginEstabelecimentoService
}
/*********************************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados da TELA DE PERFIL DO ESTABELECIMENTO no banco de dados MySQL
 * Data: 03/11/2026 - (terça-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
*********************************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../global_knex/global_knex.js')

// Função para buscar os dados do perfil do estabelecimento
const selectByIdPerfilEstabelecimento = async function (idEstabelecimento) {
    try {
        let sql = 'call procPerfilEstabelecimento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
            'SELECT_BY_ID',
            idEstabelecimento,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false

    } catch (error) {
        return false
    }
}

// Função para consultar e bloquear os dados do estabelecimento durante a transação
const selectPerfilEstabelecimentoForUpdate = async function (idEstabelecimento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procPerfilEstabelecimento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_FOR_UPDATE',
            idEstabelecimento,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false

    } catch (error) {
        return false
    }
}

// Função para buscar as coordenadas das empresas coletoras vinculadas ao estabelecimento
const selectEmpresasColetorasPerfilEstabelecimento = async function (idEstabelecimento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procPerfilEstabelecimento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_EMPRESAS_COLETORAS',
            idEstabelecimento,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false

    } catch (error) {
        return false
    }
}

// Função para atualizar os dados do perfil do estabelecimento
const updatePerfilEstabelecimento = async function (perfil, idEstabelecimento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procPerfilEstabelecimento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            idEstabelecimento,
            perfil.nome_empresa,
            perfil.telefone,
            perfil.email,
            perfil.cep,
            perfil.logradouro,
            perfil.numero,
            perfil.bairro,
            perfil.latitude,
            perfil.longitude,
            perfil.id_cidade
        ])

        if (result && result[0][0][0].affectedRows)
            return result[0][0][0].affectedRows
        else
            return false

    } catch (error) {
        return false
    }
}

// Função para atualizar a distância entre o estabelecimento e uma empresa coletora
const updateDistanciaPerfilEstabelecimento = async function (registro, idEstabelecimento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procDistancia(?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            registro.distancia,
            idEstabelecimento,
            registro.id_empresa_coletora,
            registro.id_distancia
        ])

        if (result && result[0][0][0].affectedRows >= 0)
            return result[0][0][0].affectedRows
        else
            return false

    } catch (error) {
        return false
    }
}

// Função para consultar e bloquear a senha do estabelecimento durante a transação
const selectSenhaEstabelecimentoForUpdate = async function (idEstabelecimento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procAlterarSenhaEstabelecimento(?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_FOR_UPDATE',
            idEstabelecimento,
            null,
            null
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false

    } catch (error) {
        return false
    }
}

// Função para atualizar a senha do estabelecimento
const updateSenhaEstabelecimento = async function (idEstabelecimento, senhaHash, senhaHashAtual, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procAlterarSenhaEstabelecimento(?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE_SENHA',
            idEstabelecimento,
            senhaHash,
            senhaHashAtual
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return result[0][0][0].affectedRows
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selectByIdPerfilEstabelecimento,
    selectPerfilEstabelecimentoForUpdate,
    selectEmpresasColetorasPerfilEstabelecimento,
    updatePerfilEstabelecimento,
    updateDistanciaPerfilEstabelecimento,
    selectSenhaEstabelecimentoForUpdate,
    updateSenhaEstabelecimento
}

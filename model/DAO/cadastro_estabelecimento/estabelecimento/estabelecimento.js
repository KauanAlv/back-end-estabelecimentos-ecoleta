/***************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados do ESTABELECIMENTO no banco de dados MySQL
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
***************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const insertEstabelecimento = async function (estabelecimento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEstabelecimento(?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT',
            estabelecimento.nome,
            estabelecimento.cnpj,
            estabelecimento.senha_hash,
            estabelecimento.id_email,
            estabelecimento.id_telefone,
            estabelecimento.id_endereco,
            null
        ])

        if (result && result[0][0][0].id)
            return result[0][0][0].id
        else
            return false

    } catch (error) {
        return false
    }
}

const updateEstabelecimento = async function (estabelecimento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEstabelecimento(?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            estabelecimento.nome,
            estabelecimento.cnpj,
            estabelecimento.senha_hash,
            estabelecimento.id_email,
            estabelecimento.id_telefone,
            estabelecimento.id_endereco,
            estabelecimento.id
        ])

        if (result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectAllEstabelecimento = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEstabelecimento(?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_ALL',
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

const selectByIdEstabelecimento = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEstabelecimento(?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
            null,
            null,
            null,
            null,
            null,
            null,
            id
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false

    } catch (error) {
        return false
    }
}

const selectEstabelecimentoByCnpj = async function (cnpj, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEstabelecimento(?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_BY_CNPJ',
            null,
            cnpj,
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

module.exports = {
    insertEstabelecimento,
    updateEstabelecimento,
    selectAllEstabelecimento,
    selectByIdEstabelecimento,
    selectEstabelecimentoByCnpj
}
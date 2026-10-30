/****************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados do STATUS DA COLETA no banco de dados MySQL
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
****************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const insertStatusColeta = async function (statusColeta, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusColeta(?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT',
            statusColeta.status,
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

const updateStatusColeta = async function (statusColeta, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusColeta(?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            statusColeta.status,
            statusColeta.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectAllStatusColeta = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusColeta(?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_ALL',
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

const selectByIdStatusColeta = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusColeta(?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
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

const deleteStatusColeta = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusColeta(?, ?, ?);'

        let result = await connection.raw(sql, [
            'DELETE',
            null,
            id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    insertStatusColeta,
    updateStatusColeta,
    selectAllStatusColeta,
    selectByIdStatusColeta,
    deleteStatusColeta
}
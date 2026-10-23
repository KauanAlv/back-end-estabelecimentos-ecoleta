/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de email no banco de dados
 * data: 06/10/2026
 * autor: Gabriel Renato
 * versão: 2.0
 **************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const insertEmail = async function (email, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEmail(?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT',
            email.email,
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

const updateEmail = async function (email, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEmail(?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            email.email,
            email.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectAllEmail = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEmail(?, ?, ?);'

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

const selectByIdEmail = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEmail(?, ?, ?);'

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

module.exports = {
    insertEmail,
    updateEmail,
    selectAllEmail,
    selectByIdEmail
}
/****************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados do STATUS DO RESÍDUO no banco de dados MySQL
 * Data: 28/10/2026 - (quarta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
****************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const insertStatusResiduo = async function (statusResiduo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusResiduo(?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT',
            statusResiduo.status,
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

const updateStatusResiduo = async function (statusResiduo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusResiduo(?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            statusResiduo.status,
            statusResiduo.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectAllStatusResiduo = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusResiduo(?, ?, ?);'

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

const selectByIdStatusResiduo = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusResiduo(?, ?, ?);'

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

const deleteStatusResiduo = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusResiduo(?, ?, ?);'

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
    insertStatusResiduo,
    updateStatusResiduo,
    selectAllStatusResiduo,
    selectByIdStatusResiduo,
    deleteStatusResiduo
}
/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de telefone no banco de dados
 * data: 06/10/2026
 * autor: Gabriel Renato
 * versão: 2.0
 **************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const insertTelefone = async function (numero, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procTelefone(?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT',
            numero.numero,
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

const updateTelefone = async function (numero, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procTelefone(?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            numero.numero,
            numero.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectAllTelefone = async function (transaction = null) {
    try {
        let connection = transaction || knexConection
    
        let sql = 'call procTelefone(?, ?, ?);'

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

const selectByIdTelefone = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procTelefone(?, ?, ?);'

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
    insertTelefone,
    updateTelefone,
    selectAllTelefone,
    selectByIdTelefone
}
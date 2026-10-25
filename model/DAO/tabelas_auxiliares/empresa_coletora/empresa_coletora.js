/***************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados da EMPRESA COLETORA no banco de dados MySQL
 * Data: 25/10/2026 - (domingo)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
***************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const selectAllEmpresaColetora = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEmpresaColetora(?, ?, ?, ?, ?, ?, ?, ?);'

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

const selectByIdEmpresaColetora = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEmpresaColetora(?, ?, ?, ?, ?, ?, ?, ?);'

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

module.exports = {
    selectAllEmpresaColetora,
    selectByIdEmpresaColetora
}
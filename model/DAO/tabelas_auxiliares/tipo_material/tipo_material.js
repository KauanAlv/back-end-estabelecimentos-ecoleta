/***************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados do TIPO DO MATERIAL no banco de dados MySQL
 * Data: 28/10/2026 - (quarta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
***************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

// Consulta todos os tipos de materiais
const selectAllTipoMaterial = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procTipoMaterial(?, ?, ?);'

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

// Consulta um tipo de material pelo ID
const selectByIdTipoMaterial = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procTipoMaterial(?, ?, ?);'

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
    selectAllTipoMaterial,
    selectByIdTipoMaterial
}
/****************************************************************************************************
 * Objetivo: Arquivo responsável por consultar os dados das OFERTAS INICIAIS no banco de dados MySQL
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
****************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

// Consulta uma oferta inicial pelo ID
const selectByIdOfertaInicial = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procOfertaInicial(?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
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
    selectByIdOfertaInicial
}
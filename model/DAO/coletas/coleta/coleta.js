/********************************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados para realizar a inserção das coletas no banco de dados MySQL
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
********************************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const insertColeta = async function (coleta, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procColeta(?, ?);'

        let result = await connection.raw(sql, [
            'INSERT',
            coleta.id_oferta_final
        ])

        if (result && result[0][0][0].id)
            return result[0][0][0].id
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    insertColeta
}
/*****************************************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados do STATUS DA COLETA HISTÓRICO (INTERMEDIÁRIA) no banco de dados MySQL
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
*****************************************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const insertStatusColetaAgendada = async function (idColeta, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusColetaHistorico(?, ?);'

        let result = await connection.raw(sql, [
            'INSERT_AGENDADA',
            idColeta
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
    insertStatusColetaAgendada
}
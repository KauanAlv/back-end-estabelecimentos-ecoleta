/*****************************************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados do STATUS DO RESÍDUO HISTÓRICO (INTERMEDIÁRIA) no banco de dados MySQL
 * Data: 28/10/2026 - (quarta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
*****************************************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const insertStatusResiduoDisponivel = async function (idResiduo, idEstabelecimento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusResiduoHistorico(?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT_DISPONIVEL',
            idResiduo,
            null,
            idEstabelecimento,
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

const insertStatusResiduoCancelado = async function (idResiduo, idEstabelecimento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusResiduoHistorico(?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT_CANCELADO',
            idResiduo,
            null,
            idEstabelecimento,
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

const insertStatusResiduoAgendado = async function (idResiduo, idEstabelecimento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusResiduoHistorico(?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT_AGENDADO',
            idResiduo,
            null,
            idEstabelecimento,
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

module.exports = {
    insertStatusResiduoDisponivel,
    insertStatusResiduoCancelado,
    insertStatusResiduoAgendado
}
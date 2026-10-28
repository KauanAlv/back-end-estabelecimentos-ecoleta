/**********************************************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados para realizar a inserção e atualização dos resíduos no banco de dados MySQL
 * Data: 28/10/2026 - (quarta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
**********************************************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const insertResiduo = async function (residuo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procResiduo(?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT',
            residuo.horario_inicial,
            residuo.horario_final,
            residuo.quantidade,
            residuo.data_disponivel,
            residuo.observacao,
            residuo.id_tipo_material,
            residuo.id_estabelecimento,
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

const updateResiduo = async function (residuo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procResiduo(?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            residuo.horario_inicial,
            residuo.horario_final,
            residuo.quantidade,
            residuo.data_disponivel,
            residuo.observacao,
            residuo.id_tipo_material,
            residuo.id_estabelecimento,
            residuo.id
        ])

        if (result && result[0][0][0].affectedRows >= 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectResiduoForUpdate = async function (id, idEstabelecimento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procResiduo(?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_FOR_UPDATE',
            null,
            null,
            null,
            null,
            null,
            null,
            idEstabelecimento,
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
    insertResiduo,
    updateResiduo,
    selectResiduoForUpdate
}
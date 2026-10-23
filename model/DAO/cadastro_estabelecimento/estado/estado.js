/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados do Estado no banco de dados
 * data: 09/10/2026
 * autor: Gabriel Renato
 * versão: 2.0
 **************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

// Se houver um id relacionado aquela sigla, retorna o id, se não, cadastra um novo
const insertOuSelectEstado = async function (estado, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEstado(?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_BY_SIGLA',
            estado.sigla,
            null,
            null
        ])

        if (Array.isArray(result[0][0]) && result[0][0].length > 0) {
            return result[0][0][0].id
        } else {
            result = await connection.raw(sql, [
                'INSERT',
                estado.sigla,
                estado.nome_estado,
                null
            ])

            if (result[0][0][0].id)
                return result[0][0][0].id
            else
                return false
        }

    } catch (error) {
        return false
    }
}

const updateEstado = async function (estado, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEstado(?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            estado.sigla,
            estado.nome_estado,
            estado.id
        ])

        if (result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectAllEstado = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEstado(?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_ALL',
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

const selectByIdEstado = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEstado(?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
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
    insertOuSelectEstado,
    updateEstado,
    selectAllEstado,
    selectByIdEstado
}
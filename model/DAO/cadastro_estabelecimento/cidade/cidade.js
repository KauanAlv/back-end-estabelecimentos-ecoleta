/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados da cidade no banco de dados
 * data: 09/10/2026
 * autor: Gabriel Renato
 * versão: 2.0
 **************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

// Se houver um id relacionado aquele estado, retorna o id, se não, cadastra um novo
const insertOuSelectCidade = async function (cidade, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procCidade(?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_BY_NOME_ESTADO',
            cidade.nome_cidade,
            cidade.id_estado,
            null
        ])

        if (Array.isArray(result[0][0]) && result[0][0].length > 0) {
            return result[0][0][0].id
        } else {
            result = await connection.raw(sql, [
                'INSERT',
                cidade.nome_cidade,
                cidade.id_estado,
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

const updateCidade = async function (cidade, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procCidade(?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            cidade.nome_cidade,
            cidade.id_estado,
            cidade.id
        ])

        if (result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectAllCidade = async function (transaction = null) {
    try {
        let connection = transaction || knexConection
        let sql = 'call procCidade(?, ?, ?, ?);'

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

const selectByIdCidade = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procCidade(?, ?, ?, ?);'

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
    insertOuSelectCidade,
    updateCidade,
    selectAllCidade,
    selectByIdCidade
}
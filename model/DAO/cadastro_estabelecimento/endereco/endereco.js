/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de endereço no banco de dados
 * data: 09/10/2026
 * autor: Gabriel Renato
 * versão: 2.0
 **************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const insertEndereco = async function (endereco, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEndereco(?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT',
            endereco.cep,
            endereco.logradouro,
            endereco.numero,
            endereco.bairro,
            endereco.latitude,
            endereco.longitude,
            endereco.id_cidade,
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

const updateEndereco = async function (endereco, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEndereco(?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            endereco.cep,
            endereco.logradouro,
            endereco.numero,
            endereco.bairro,
            endereco.latitude,
            endereco.longitude,
            endereco.id_cidade,
            endereco.id
        ])

        if (result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectAllEndereco = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEndereco(?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_ALL',
            null,
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

const selectByIdEndereco = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procEndereco(?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
            null,
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
    insertEndereco,
    updateEndereco,
    selectAllEndereco,
    selectByIdEndereco
}
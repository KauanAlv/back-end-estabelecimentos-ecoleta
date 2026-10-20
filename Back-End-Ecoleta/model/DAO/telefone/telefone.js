/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de telefone no banco de dados
 * data: 06/10/2026
 * autor: Gabriel Renato
 * versão: 2.0
 **************************************************************************************/


//import da biblioteca para manipular dados no banco de dados mysql
const knex = require('knex')

//import do arquivo de configuracao para acesso ao banco de dados
const knexdatabaseConfig = require('../../database_config/knexConfig.js')
const knexConection = knex(knexdatabaseConfig.development)

const insertTelefone = async function (numero) {
    try {
        let sql = 'call procTelefone(?, ?, ?);'

        let result = await knexConection.raw(sql, [
            'INSERT',
            numero.numero,
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

const updateTelefone = async function (numero) {
    try {
        let sql = 'call procTelefone(?, ?, ?);'

        let result = await knexConection.raw(sql, [
            'UPDATE',
            numero.numero,
            numero.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectAllTelefone = async function () {

    try {
        let sql = 'call procTelefone(?, ?, ?);'

        let result = await knexConection.raw(sql, [
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

const selectByIdTelefone = async function (id) {
    try {
        let sql = 'call procTelefone(?, ?, ?);'

        let result = await knexConection.raw(sql, [
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
    insertTelefone,
    updateTelefone,
    selectAllTelefone,
    selectByIdTelefone
}
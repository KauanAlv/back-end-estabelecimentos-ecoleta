/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de endereço no banco de dados
 * data: 09/10/2026
 * autor: Gabriel Renato
 * versão: 2.0
 **************************************************************************************/


//import da biblioteca para manipular dados no banco de dados mysql
const knex = require('knex')

//import do arquivo de configuracao para acesso ao banco de dados
const knexdatabaseConfig = require('../../database_config/knexConfig.js')
const knexConection = knex(knexdatabaseConfig.development)

const insertEndereco = async function (endereco) {
    try {
        let sql = 'call procEndereco(?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
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

const updateEndereco = async function (endereco) {
    try {
        let sql = 'call procEndereco(?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
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

const selectAllEndereco = async function () {
    try {
        let sql = 'call procEndereco(?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
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

const selectByIdEndereco = async function (id) {
    try {
        let sql = 'call procEndereco(?, ?, ?, ?, ?, ?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
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
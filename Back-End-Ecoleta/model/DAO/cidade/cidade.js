/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados da cidade no banco de dados
 * data: 09/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/


//import da biblioteca para manipular dados no banco de dados mysql
const knex = require('knex')

//import do arquivo de configuracao para acesso ao banco de dados
const knexdatabaseConfig = require('../../database_config/knexConfig.js')
const knexConection = knex(knexdatabaseConfig.development)

// Se houver um id relacionado aquele estado, retorna o id, se não, cadastra um novo
const insertOuSelectCidade = async function (cidade) {
    try {
        let sql = 'call procCidade(?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
            'SELECT_BY_NOME_ESTADO',
            cidade.nome_cidade,
            cidade.id_estado,
            null
        ])

        if (Array.isArray(result[0][0]) && result[0][0].length > 0) {
            return result[0][0][0].id
        } else {
            result = await knexConection.raw(sql, [
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

const updateCidade = async function (cidade) {
    try {
        let sql = 'call procCidade(?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
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

const selectAllCidade = async function () {
    try {
        let sql = 'call procCidade(?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
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

const selectByIdCidade = async function (id) {
    try {
        let sql = 'call procCidade(?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
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
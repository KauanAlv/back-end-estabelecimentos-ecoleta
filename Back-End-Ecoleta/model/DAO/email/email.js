/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de email no banco de dados
 * data: 06/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/


//import da biblioteca para manipular dados no banco de dados mysql
const knex = require('knex')

//import do arquivo de configuracao para acesso ao banco de dados
const knexdatabaseConfig = require('../../database_config/knexConfig.js')
const knexConection = knex(knexdatabaseConfig.development)

const insertEmail = async function (email)  {
    try {
        let sql = `insert into tbl_email(
        email
    ) values(
        '${email.email}'
        );`

        let result = await knexConection.raw(sql)

        if(result)
            return result[0].insertId
        else
            return false
        
    } catch (error) {
        return false
    }
}

const updateEmail = async function (email)  {
    try {
        let sql = `update tbl_email set
                    email           = '${email.email}'
                where id = ${email.id}`

        let result = await knexConection.raw(sql)

        if(result)
            return true
        else
            return false
        
    } catch (error) {
        return false
    }
}

const selectByIdEmail = async function (id)  {
    try {
        let sql = `select * from tbl_email where id = ${id}`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result))
            return result[0]
        else
            return false
        
    } catch (error) {
        return false
    }
}

const selectAllEmail = async function ()  {
    try {
        let sql = `select * from tbl_email`

        let result = await knexConection.raw(sql)

        if(result && result[0])
            return JSON.parse(JSON.stringify(result[0]))
        else
            return false
        
    } catch (error) {
        return false
    }
}

module.exports = {
    insertEmail,
    updateEmail,
    selectByIdEmail,
    selectAllEmail
}
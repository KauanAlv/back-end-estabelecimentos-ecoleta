/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de telefone no banco de dados
 * data: 06/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/


//import da biblioteca para manipular dados no banco de dados mysql
const knex = require('knex')

//import do arquivo de configuracao para acesso ao banco de dados
const knexdatabaseConfig = require('../../database_config/knexConfig.js')
const knexConection = knex(knexdatabaseConfig.development)

const insertTelefone = async function (telefone)  {
    try {
        let sql = `insert into tbl_telefone(
        numero
    ) values(
        '${telefone.numero}'
        );`

        let result = await knexConection.raw(sql)

        if(result)
            return result[0].insertId
        else
            return false
        
    } catch (error) {
        console.log(error)
        return false
    }
}

const updateTelefone = async function (telefone)  {
    try {
        let sql = `update tbl_telefone set
                    telefone           = '${telefone.telefone}'
                where id = ${telefone.id}`

        let result = await knexConection.raw(sql)

        if(result)
            return true
        else
            return false
        
    } catch (error) {
        return false
    }
}

const selectByIdTelefone = async function (id)  {
    try {
        let sql = `select * from tbl_telefone where id = ${id}`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result))
            return result[0]
        else
            return false
        
    } catch (error) {
        return false
    }
}

const selectAllTelefone = async function ()  {
    try {
        let sql = `select * from tbl_telefone`

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
    insertTelefone,
    updateTelefone,
    selectByIdTelefone,
    selectAllTelefone
}
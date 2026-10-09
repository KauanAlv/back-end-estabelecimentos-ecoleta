/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de endereço no banco de dados
 * data: 09/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/


//import da biblioteca para manipular dados no banco de dados mysql
const knex = require('knex')

//import do arquivo de configuracao para acesso ao banco de dados
const knexdatabaseConfig = require('../../database_config/knexConfig.js')
const knexConection = knex(knexdatabaseConfig.development)

const insertEndereco = async function (endreco)  {

    try {
        let sql = `insert into tbl_endereco(
        cep,
        logradouro,
        numero,
        bairro,
        latitude,
        longitude,
        id_cidade
    ) values(
        '${cidade.cep}',
        '${cidade.logradouro}',
        '${cidade.numero}',
        '${cidade.bairro}',
        '${cidade.latitude}',
        '${cidade.longitude}',
        '${cidade.id_cidade}'
        );`

        let result = await knexConection.raw(sql)

        console.log(sql)
        if(result)
            return result[0].insertId
        else
            return false
        
    } catch (error) {
        
        return false
    }
}


const updateEstado = async function (estado)  {
    try {
        let sql = `update tbl_estado set
                    sigla           = '${estado.sigla}',
                    nome_estado     = '${estado.nome_estado}'
                where id = ${estado.id}`

        let result = await knexConection.raw(sql)

        if(result)
            return true
        else
            return false
        
    } catch (error) {
        return false
    }
}



module.exports = {
    insertEndereco
    //updateEstado
}
/*****************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados da TELA DE HISTÓRICO no banco de dados MySQL
 * Data: 03/11/2026 - (sexta-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
*****************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../../global_knex/global_knex.js')

// Consulta os dados para a tela de Histórico
const selectAllColetasEstabelecimento = async function (idEstabelecimento) {
    try {
        let sql = `select * from vw_coletas_estabelecimento where id_estabelecimento = ?;`

        let result = await knexConection.raw(sql, [idEstabelecimento])

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}


const selectColetaHistoricoEstabelecimento = async function (idEstabelecimento, idOfertaInicial) {
    try {
        let sql = `select * from vw_coletas_estabelecimento where id_estabelecimento = ? and id_oferta_inicial = ?;`

        let result = await knexConection.raw(sql, [idEstabelecimento, idOfertaInicial])

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}


module.exports = {
    selectAllColetasEstabelecimento,
    selectColetaHistoricoEstabelecimento
}
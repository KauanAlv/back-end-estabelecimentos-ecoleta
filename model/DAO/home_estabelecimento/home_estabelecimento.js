/********************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados da TELA HOME no banco de dados MySQL
 * Data: 22/10/2026 - (quinta-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
*********************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../global_knex/global_knex.js')

// Consulta o resumo da Home
const selectResumoHomeEstabelecimento = async function (idEstabelecimento) {
    try {
        let sql = `select * from vw_home_estabelecimento where id_estabelecimento = ?;`

        let result = await knexConection.raw(sql, [idEstabelecimento])

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}

// Consulta as ofertas exibidas na Home
const selectOfertasHomeEstabelecimento = async function (idEstabelecimento) {
    try {
        let sql = `select * from vw_home_ofertas_estabelecimento where id_estabelecimento = ?;`

        let result = await knexConection.raw(sql, [idEstabelecimento])

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selectResumoHomeEstabelecimento,
    selectOfertasHomeEstabelecimento
}
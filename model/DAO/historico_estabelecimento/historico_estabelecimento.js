/********************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados da TELA HOME no banco de dados MySQL
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
*********************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../global_knex/global_knex.js')

// Consulta o resumo da Home
const selectHistoricoEstabelecimento = async function (idEstabelecimento) {
    try {
        let sql = `select * from vw_historico_estabelecimento where id_estabelecimento = ? order by data_hora_evento desc;`

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
    selectHistoricoEstabelecimento
}
/***********************************************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os cancelamentos das ofertas atreladas a um resíduo cancelado no banco de dados MySQL
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
***********************************************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

// Função para recusar as ofertas pendentes vinculadas a um resíduo
const recusarOfertasPendentesResiduo = async function (idResiduo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procRecusarOfertasPendentesResiduo(?, ?);'

        let result = await connection.raw(sql, [
            idResiduo,
            idEstabelecimento
        ])

        if (result && result[0] && result[0][0] && result[0][0][0])
            return result[0][0][0].affectedRows
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    recusarOfertasPendentesResiduo
}
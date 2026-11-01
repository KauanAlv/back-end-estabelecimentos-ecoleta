/****************************************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados para realizar a inserção das OFERTAS ACEITAS no banco de dados MySQL
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
****************************************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

const insertOfertaAceita = async function (ofertaAceita, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procOfertaAceita(?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT',
            ofertaAceita.nome_aceitante,
            ofertaAceita.id_estabelecimento
        ])

        if (result && result[0][0][0].id)
            return result[0][0][0].id
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    insertOfertaAceita
}
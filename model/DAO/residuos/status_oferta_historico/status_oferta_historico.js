/*****************************************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados do STATUS DA OFERTA HISTÓRICO (INTERMEDIÁRIA) no banco de dados MySQL
 * Data: 30/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
*****************************************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

// Função para inserir o status Aceita no histórico da oferta
const insertStatusOfertaAceita = async function (idOfertaInicial, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusOfertaHistorico(?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT_ACEITA',
            idOfertaInicial,
            null,
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

// Função para inserir o status Recusada no histórico de uma oferta
const insertStatusOfertaRecusada = async function (idOfertaInicial, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procStatusOfertaHistorico(?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT_RECUSADA',
            idOfertaInicial,
            null,
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

// Função para recusar as ofertas pendentes vinculadas a um resíduo
const recusarOfertasPendentesResiduo = async function (idResiduo, idEstabelecimento, transaction = null) {
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
    insertStatusOfertaAceita,
    insertStatusOfertaRecusada,
    recusarOfertasPendentesResiduo
}
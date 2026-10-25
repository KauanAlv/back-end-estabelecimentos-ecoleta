/*******************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados da DISTANCIA no banco de dados MySQL
 * Data: 25/10/2026 - (domingo)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
********************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

// Insere ou atualiza a distância entre um estabelecimento e uma empresa coletora
const insertDistancia = async function (distancia, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procDistancia(?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'INSERT',
            distancia.distancia,
            distancia.id_estabelecimento,
            distancia.id_empresa_coletora,
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

const updateDistancia = async function (distancia, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = 'call procDistancia(?, ?, ?, ?, ?);'

        let result = await connection.raw(sql, [
            'UPDATE',
            distancia.distancia,
            distancia.id_estabelecimento,
            distancia.id_empresa_coletora,
            distancia.id
        ])

        if (result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectAllDistancia = async function () {
    try {
        let sql = 'call procDistancia(?, ?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
            'SELECT_ALL',
            null,
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

const selectByIdDistancia = async function (id) {
    try {
        let sql = 'call procDistancia(?, ?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
            'SELECT_BY_ID',
            null,
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

// Retorna todas as empresas coletoras relacionadas a um estabelecimento
const selectByIdEstabelecimento = async function (idEstabelecimento) {
    try {
        let sql = 'call procDistancia(?, ?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
            'SELECT_BY_ESTABELECIMENTO',
            null,
            idEstabelecimento,
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

// Retorna todos os estabelecimentos relacionados a uma empresa coletora
const selectByIdEmpresaColetora = async function (idEmpresaColetora) {
    try {
        let sql = 'call procDistancia(?, ?, ?, ?, ?);'

        let result = await knexConection.raw(sql, [
            'SELECT_BY_EMPRESA_COLETORA',
            null,
            null,
            idEmpresaColetora,
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

module.exports = {
    insertDistancia,
    updateDistancia,
    selectAllDistancia,
    selectByIdDistancia,
    selectByIdEstabelecimento,
    selectByIdEmpresaColetora
}
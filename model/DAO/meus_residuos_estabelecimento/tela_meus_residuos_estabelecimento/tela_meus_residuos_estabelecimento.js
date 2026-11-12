/********************************************************************************************************
 * Objetivo: Arquivo responsável por manipular os dados da TELA DE MEUS RESÍDUOS no banco de dados MySQL
 * Data: 22/10/2026 - (quinta-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
********************************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../../global_knex/global_knex.js')

// Consulta os dados para a tela de Meus Resíduos
const selectMeusResiduosEstabelecimento = async function (idEstabelecimento) {
    try {          
        let sql = `select * from vw_meus_residuos_estabelecimento where id_estabelecimento = ? order by id_residuo desc;`


        let result = await knexConection.raw(sql, [idEstabelecimento])

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}

// Consulta os detalhes de uma coleta Agendada
const selectMeuResiduoEstabelecimento = async function (idEstabelecimento, idResiduo) {
    try {         
        let sql = `select * from vw_coleta_residuo_estabelecimento where id_estabelecimento = ? and id_residuo = ?;`

        let result = await knexConection.raw(sql, [idEstabelecimento, idResiduo])

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selectMeusResiduosEstabelecimento,
    selectMeuResiduoEstabelecimento
}
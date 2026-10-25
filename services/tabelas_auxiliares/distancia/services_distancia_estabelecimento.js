/************************************************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas a DISTÂNCIA ENTRE ESTABELECIMENTO E EMPRESA COLETORA
 * Data: 25/10/2026 - (domingo)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
************************************************************************************************************************************/

// IMPORT DAS DAOs
const estabelecimentoDAO = require('../../../model/DAO/cadastro_estabelecimento/estabelecimento/estabelecimento.js')
const empresaColetoraDAO = require('../../../model/DAO/tabelas_auxiliares/empresa_coletora/empresa_coletora.js')
const distanciaDAO = require('../../../model/DAO/tabelas_auxiliares/distancia/distancia.js')

// IMPORT DA FUNÇÃO PARA CALCULAR A DISTÂNCIA
const distanciaAPI = require('../../../utils//geolocalizacao.js')

// Função para calcular as distâncias de um novo estabelecimento
const calcularDistanciasNovoEstabelecimento = async function (idEstabelecimento) {
    try {

        // Busca os dados do estabelecimento recém-cadastrado
        let estabelecimentos = await estabelecimentoDAO.selectByIdEstabelecimento(idEstabelecimento)

        if (estabelecimentos === false || !Array.isArray(estabelecimentos) || estabelecimentos.length === 0)
            return false

        let estabelecimento = estabelecimentos[0]

        // Busca todas as empresas coletoras existentes
        let empresasColetoras = await empresaColetoraDAO.selectAllEmpresaColetora()

        if (empresasColetoras === false || !Array.isArray(empresasColetoras))
            return false

        // Percorre todas as empresas coletoras cadastradas
        for (let empresaColetora of empresasColetoras) {

            // Coordenadas de origem: empresa coletora
            let origem = {
                latitude: empresaColetora.latitude,
                longitude: empresaColetora.longitude
            }

            // Coordenadas de destino: estabelecimento
            let destino = {
                latitude: estabelecimento.latitude,
                longitude: estabelecimento.longitude
            }

            // Calcula a distância em quilômetros
            // Retorna null caso não seja possível calcular
            let distanciaCalculada = await distanciaAPI.calcularDistancia(origem, destino)

            // Prepara os dados da distância
            let dadosDistancia = {
                distancia: distanciaCalculada,
                id_estabelecimento: idEstabelecimento,
                id_empresa_coletora: empresaColetora.id_empresa_coletora
            }

            // Insere a relação na tabela de distância
            let idDistancia = await distanciaDAO.insertDistancia(dadosDistancia)

            if (idDistancia === false || idDistancia == null)
                return false
        }

        return true

    } catch (error) {
        console.error('Erro ao calcular as distâncias do estabelecimento:', error.message)
        return false
    }
}

module.exports = {
    calcularDistanciasNovoEstabelecimento
}
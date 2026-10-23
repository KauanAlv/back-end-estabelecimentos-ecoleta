/****************************************************
 * Objetivo: Arquivo responsável pela Geolocalização
 * Data: 20/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
 ****************************************************/

// IMPORT DA BIBLIOTECA PARA CONSULTAR APIs EXTERNAS
const axios = require('axios')

// Função para buscar as coordenadas do endereço
const buscarCoordenadasEndereco = async function (endereco) {

    try {

        // URL DA API DE GEOCODIFICAÇÃO
        let url = 'https://api.heigit.org/pelias/v1/search'

        // MONTA O ENDEREÇO PARA CONSULTA
        let textoEndereco =
            endereco.logradouro + ', ' +
            endereco.numero + ', ' +
            endereco.nome_cidade + ', ' +
            endereco.sigla_estado

        // CONSULTA A API DE GEOCODIFICAÇÃO
        let resposta = await axios.get(
            url,
            {
                params: {
                    text: textoEndereco,
                    size: 5
                },
                headers: {
                    'Authorization': process.env.GEOLC_API_KEY,
                    'Accept-Language': 'pt'
                },
                timeout: 10000
            }
        )

        // OBTÉM OS RESULTADOS DA CONSULTA
        let features = resposta.data.features

        // VERIFICA SE A API RETORNOU RESULTADOS
        if (!Array.isArray(features) || features.length === 0) {

            console.log('Nenhum resultado encontrado para o endereço.')

            return {
                latitude: null,
                longitude: null
            }
        }

        // NORMALIZA OS DADOS ESPERADOS
        let cidadeEsperada = endereco.nome_cidade.trim().toLowerCase()
        let estadoEsperado = endereco.sigla_estado.trim().toLowerCase()

        // PROCURA O RESULTADO QUE MELHOR CORRESPONDE À CIDADE E AO ESTADO
        let resultadoEndereco = features.find(function (feature) {

            if (
                !feature.properties ||
                !feature.geometry ||
                feature.geometry.type !== 'Point' ||
                !Array.isArray(feature.geometry.coordinates) ||
                feature.geometry.coordinates.length < 2
            ) {
                return false
            }

            let propriedades = feature.properties

            let cidadeEncontrada = (
                propriedades.locality ||
                propriedades.localadmin ||
                ''
            ).trim().toLowerCase()

            let estadoEncontrado = (
                propriedades.region_a ||
                ''
            ).trim().toLowerCase()

            // CONFERE A CIDADE E O ESTADO QUANDO INFORMADOS PELA API
            return cidadeEncontrada === cidadeEsperada &&
                estadoEncontrado === estadoEsperado
        })

        // VERIFICA SE FOI ENCONTRADO UM RESULTADO COMPATÍVEL
        if (!resultadoEndereco) {

            console.log(
                'Nenhum resultado corresponde à cidade e ao estado informados.'
            )

            console.log(
                'Primeiro resultado retornado:',
                features[0].properties
                    ? features[0].properties.label
                    : 'Sem informações de endereço'
            )

            return {
                latitude: null,
                longitude: null
            }
        }

        // OBTÉM AS PROPRIEDADES DO RESULTADO
        let propriedades = resultadoEndereco.properties

        // EXIBE INFORMAÇÕES PARA AVALIAR A CORRESPONDÊNCIA
        console.log('Endereço pesquisado:', textoEndereco)

        console.log('Endereço retornado:', propriedades.label)

        console.log('Cidade retornada:', propriedades.locality)

        console.log('Estado retornado:', propriedades.region_a)

        console.log('Tipo de resultado:', propriedades.layer)

        console.log('Precisão:', propriedades.accuracy)

        console.log('Correspondência:', propriedades.match_type)

        console.log('Confiança:', propriedades.confidence)

        // AVISA QUANDO A API RETORNA UMA LOCALIZAÇÃO APROXIMADA
        if (
            propriedades.accuracy === 'centroid' ||
            propriedades.match_type === 'fallback'
        ) {
            console.log(
                'Aviso: a API retornou uma localização aproximada, ' +
                'que pode representar o centro da rua.'
            )
        }

        // OBTÉM AS COORDENADAS RETORNADAS PELA API
        let coordenadas = resultadoEndereco.geometry.coordinates

        // A API RETORNA LONGITUDE PRIMEIRO E LATITUDE DEPOIS
        let longitude = coordenadas[0]
        let latitude = coordenadas[1]

        // VALIDA AS COORDENADAS
        if (
            typeof latitude !== 'number' ||
            typeof longitude !== 'number' ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {

            console.log('A API retornou coordenadas inválidas.')

            return {
                latitude: null,
                longitude: null
            }
        }

        // EXIBE AS COORDENADAS ENCONTRADAS
        console.log('Latitude:', latitude)
        console.log('Longitude:', longitude)

        // RETORNA AS COORDENADAS
        return {
            latitude: latitude,
            longitude: longitude
        }

    } catch (erro) {

        // TRATA ERROS DA CONSULTA
        console.error(
            'Erro ao consultar a API de geolocalização:',
            erro.response
                ? 'Status HTTP ' + erro.response.status
                : erro.message
        )

        return {
            latitude: null,
            longitude: null
        }
    }
}

module.exports = {
    buscarCoordenadasEndereco
}
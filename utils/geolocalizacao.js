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
        let url = 'https://nominatim.openstreetmap.org/search'

        // MONTA O ENDEREÇO PARA CONSULTA
        let numero = String(endereco.numero)
        let logradouro = endereco.logradouro
        let cidade = endereco.nome_cidade
        let estado = endereco.nome_estado
        let cep = String(endereco.cep).replace(/\D/g, '')

        // CONSULTA A API DE GEOCODIFICAÇÃO
        let resposta = await axios.get(
            url,
            {
                params: {
                    street: numero + '/' + logradouro,
                    city: cidade,
                    state: estado,
                    country: 'Brasil',
                    postalcode: cep,
                    format: 'jsonv2',
                    addressdetails: 1,
                    limit: 5,
                    countrycodes: 'br'
                },
                headers: {
                    'User-Agent': 'Ecoleta-TCC/1.0 (contato: kauan0alvess@gmail.com)',
                    'Accept-Language': 'pt-BR'
                },
                timeout: 10000
            }
        )

        // OBTÉM OS RESULTADOS DA CONSULTA
        let resultados = resposta.data

        // VERIFICA SE A API RETORNOU RESULTADOS
        if (!Array.isArray(resultados) || resultados.length === 0) {

            console.log('Nenhum resultado encontrado para o endereço.')

            return {
                latitude: null,
                longitude: null
            }
        }

        // NORMALIZA OS TEXTOS PARA COMPARAÇÃO
        const normalizarTexto = function (texto) {
            return String(texto || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .trim()
                .toLowerCase()
        }

        // NORMALIZA OS DADOS ESPERADOS
        let logradouroEsperado = normalizarTexto(logradouro)
        let cidadeEsperada = normalizarTexto(cidade)
        let estadoEsperado = normalizarTexto(estado)


        // PROCURA UM RESULTADO COMPATÍVEL COM O ENDEREÇO

        // PROCURA O RESULTADO QUE MELHOR CORRESPONDE À CIDADE E AO ESTADO
        let resultadoEndereco = resultados.find(function (resultado) {

            if (!resultado.address) {
                return false
            }

            let enderecoRetornado = resultado.address
            let logradouroEncontrado = normalizarTexto(enderecoRetornado.road || enderecoRetornado.pedestrian || enderecoRetornado.residential || '')
            let cidadeEncontrada = normalizarTexto(enderecoRetornado.city || enderecoRetornado.town || enderecoRetornado.municipality || '')
            let estadoEncontrado = normalizarTexto(enderecoRetornado.state || '')

            // VERIFICA SE O LOGRADOURO, A CIDADE E O ESTADO CORRESPONDEM
            return (
                logradouroEncontrado === logradouroEsperado &&
                cidadeEncontrada === cidadeEsperada &&
                estadoEncontrado === estadoEsperado
            )
        })

        // VERIFICA SE FOI ENCONTRADO UM ENDEREÇO COMPATÍVEL
        if (!resultadoEndereco) {

            console.log(
                'Nenhum resultado corresponde ao logradouro, cidade e estado informados.'
            )

            return {
                latitude: null,
                longitude: null
            }
        }

        // OBTÉM AS COORDENADAS RETORNADAS PELA API
        let latitude = Number(resultadoEndereco.lat)
        let longitude = Number(resultadoEndereco.lon)

        // VALIDA AS COORDENADAS
        if (
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

        // VERIFICA SE O NÚMERO DO IMÓVEL FOI IDENTIFICADO
        let numeroEncontrado = resultadoEndereco.address.house_number

        if (!numeroEncontrado || String(numeroEncontrado).trim() !== numero) {
            console.log(
                'Aviso: o Nominatim encontrou o logradouro, ' +
                'mas não confirmou o número do imóvel.'
            )
        }

        // VERIFICA SE O CEP RETORNADO CORRESPONDE AO INFORMADO
        let cepEncontrado = resultadoEndereco.address.postcode

        if (cepEncontrado && String(cepEncontrado).replace(/\D/g, '') !== cep) {
            console.log(
                'Aviso: o CEP retornado pela API é diferente do informado.'
            )

            console.log('CEP informado:', cep)
            console.log('CEP retornado:', cepEncontrado)
        }

        // EXIBE AS INFORMAÇÕES DO ENDEREÇO ENCONTRADO
        console.log('Endereço retornado pela API:', resultadoEndereco.display_name)
        console.log('Tipo de resultado:', resultadoEndereco.type)
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

// Função para calcular a distância entre dois endereços
const calcularDistancia = async function (origem, destino) {
    try {

        // VERIFICA SE AS COORDENADAS EXISTEM
        if (
            !origem ||
            !destino ||
            origem.latitude == null ||
            origem.longitude == null ||
            destino.latitude == null ||
            destino.longitude == null
        ) {
            console.log('Não foi possível calcular a distância: coordenadas ausentes.')
            return null
        }

        // CONVERTE AS COORDENADAS PARA NÚMEROS
        let latitudeOrigem = Number(origem.latitude)
        let longitudeOrigem = Number(origem.longitude)

        let latitudeDestino = Number(destino.latitude)
        let longitudeDestino = Number(destino.longitude)

        // VALIDA AS COORDENADAS
        if (
            !Number.isFinite(latitudeOrigem) ||
            !Number.isFinite(longitudeOrigem) ||
            !Number.isFinite(latitudeDestino) ||
            !Number.isFinite(longitudeDestino) ||
            Math.abs(latitudeOrigem) > 90 ||
            Math.abs(latitudeDestino) > 90 ||
            Math.abs(longitudeOrigem) > 180 ||
            Math.abs(longitudeDestino) > 180
        ) {
            console.log('Não foi possível calcular a distância: coordenadas inválidas.')
            return null
        }

        // URL DA API DE CÁLCULO DE DISTÂNCIA
        let url = 'https://api.heigit.org/openrouteservice/v2/directions/driving-car'

        // CONSULTA A API
        let resposta = await axios.post(
            url,
            {
                coordinates: [
                    [longitudeOrigem, latitudeOrigem],
                    [longitudeDestino, latitudeDestino]
                ]
            },
            {
                headers: {
                    'Authorization': process.env.GEOLC_DISTANCIA_API_KEY,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 15000
            }
        )

        // OBTÉM A DISTÂNCIA RETORNADA PELA API EM METROS
        let distanciaMetros = resposta.data?.routes?.[0]?.summary?.distance

        // VALIDA A DISTÂNCIA
        if (
            typeof distanciaMetros !== 'number' ||
            !Number.isFinite(distanciaMetros) ||
            distanciaMetros < 0
        ) {
            console.log('A API não retornou uma distância válida.')
            return null
        }

        // CONVERTE A DISTÂNCIA DE METROS PARA QUILÔMETROS
        let distanciaKm = Number((distanciaMetros / 1000).toFixed(2))

        console.log('Distância calculada:', distanciaKm, 'km')

        // RETORNA A DISTÂNCIA EM QUILÔMETROS
        return distanciaKm

    } catch (erro) {

        // TRATA ERROS DA CONSULTA
        console.error(
            'Erro ao consultar a API de distância:',
            erro.response
                ? 'Status HTTP ' + erro.response.status
                : erro.message
        )

        return null
    }
}

module.exports = {
    buscarCoordenadasEndereco,
    calcularDistancia
}
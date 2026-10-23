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

module.exports = {
    buscarCoordenadasEndereco
}
/**************************************************************************************
 * objetivo: arquivo responsavel por ser a API
 * data: 20/10/2026 - (terça-feira)
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/


const express = require('express')
const bodyparser = require('body-parser')

//permitindo a utilização do JSON no body das requisições
const bodyparserJSON = bodyparser.json()

//criando um objeto de rota para os andpoints de genero
const router = express.Router()

const controllerCidade = require('../controller/cidade/controller_cidade.js')

router.post('/', bodyparserJSON, async function(request, response){
    let dados = request.body
    let contenType = request.headers['content-type']
    let result = await controllerCidade.inserirNovaCidade(dados,contenType)

    response.status (result.status_code)
    response.json(result)
})

router.get('/', bodyparserJSON, async function(request, response){
    let result = await controllerCidade.listarCidade()

    response.status (result.status_code)
    response.json(result)
})

module.exports = router

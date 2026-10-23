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

const controllerEmail = require('../controller/email/conroller_email.js')

router.post('/', bodyparserJSON, async function(request, response){
    let dados = request.body
    let contenType = request.headers['content-type']
    let result = await controllerEmail.inserirNovoEmail(dados, contenType)

    response.status (result.status_code)
    response.json(result)
})

router.get('/', bodyparserJSON, async function(request, response){
    let result = await controllerEmail.listarEmail()

    response.status (result.status_code)
    response.json(result)
})

module.exports = router
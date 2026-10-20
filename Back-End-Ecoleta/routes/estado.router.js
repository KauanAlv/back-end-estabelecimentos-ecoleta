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

const controllerCidade = require('../controller/estado/controller_estado.js')
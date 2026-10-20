/**************************************************************************************
 * objetivo: arquivo responsavel por ser a API
 * data: 07/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/

require('dotenv').config()

const express   = require ('express')
const cors      = require ('cors')
const bodyparser = require('body-parser')

//permitindo a utilização do body das requisições
const bodyparserJSON = bodyparser.json()

const app = express()

const corsOptions = {
    origin:['*'],    //configuração de origin da requisição (IP ou dominio)
    methods: 'GET, POST, PUT, DELETE, OPTION',  //configuração dos verbos q serão utilizados na API
    allowedHeaders: ['Content-type', 'Authorization'] //configurações de permissões
                     //tipo de dados   //autorização de acesso
}

//aplica as configurações do cors no app (EXPRESS)
app.use(cors(corsOptions))



const cidadeRouter = require('./routes/cidade.router.js')
app.use('/cadastro/cidade/estabelecimento', cors(), cidadeRouter)



const emailRouter = require('./routes/email.router.js')
app.use('/cadastro/email/estabelecimento', cors(), emailRouter)



const telefoneRouter = require('./routes/telefone.router.js')
app.use('/cadastro/telefone/estabelecimento', cors(), telefoneRouter)



const estadoRouter = require('./routes/estado.router.js')
app.use('/cadastro/estado/estabelecimento', cors(), estadoRouter)



const enderecoRouter = require('./routes/endereco.router.js')
app.use('/cadastro/endereco/estabelecimento', cors(), enderecoRouter)




app.listen(1010, function(){
    console.log('API aguardadndo novas requisições ...')
})
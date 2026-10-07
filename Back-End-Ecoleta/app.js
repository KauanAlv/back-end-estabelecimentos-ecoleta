/**************************************************************************************
 * objetivo: arquivo responsavel por manipular os dados de email no banco de dados
 * data: 06/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/


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

//import das controller provisório
const controllerEmail = require('./controller/email/conroller_email.js')
const controllerTelefone = require('./controller/telefone/conroller_telefone')

app.post('/cadastro/estabelecimento/Telefone', bodyparserJSON, async function(request, response){
    let dados = request.body
    let contenType = request.headers['content-type']
    let result = await controllerTelefone.insertTelefone(dados,contenType)

    response.status (result.status_code)
    response.json(result)
})

app.put('/cadastro/estabelecimento/Telefone', bodyparserJSON, async function(request, response){
    let dados = request.body
    let contenType = request.headers['content-type']
    let result = await controllerTelefone.insertTelefone(dados,contenType)

    response.status (result.status_code)
    response.json(result)
})

app.get('/cadastro/estabelecimento/Email/:id', bodyparserJSON, async function(request, response){
    let id = request.params.id

    let result = await controllerTelefone.buscarTelefone(id)

    response.status (result.status_code)
    response.json(result)
})


app.get('/cadastro/estabelecimento/Email', bodyparserJSON, async function(request, response){
    let result = await controllerTelefone.listarTelefone()

    response.status (result.status_code)
    response.json(result)
})



app.listen(1010, function(){
    console.log('API aguardadndo novas requisições ...')
})
/**************************************************************************************
 * objetivo: arquivo responsavel por ser a API
 * data: 07/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
 **************************************************************************************/

//Import no .env
require('dotenv').config()

//Import das dependências para criar a API
const express = require('express')
const cors = require('cors')

//Criando um objeto do express para criar a API
const app = express()

//Configurações no cors da API
const corsOptions = {
    origin: '*',   //Configuração de origem da requisição (IP ou Dominío)
    methods: 'GET, POST, PUT, DELETE, OPTIONS', //Configuração dos verbos que serão ultilizados na API
    allowedHeaders: ['Content-type', 'Authorization'], //Configurações de permissões
    //                    └── Tipo de dados    └── Autorização de acesso
}

//Aplica as configurações do CORS no app (EXPRESS)
app.use(cors(corsOptions))

// =================
//     ENDPOINTS 
// =================

// ================= CADASTRO ESTABELECIMENTO =================
const cadastroEstabelecimento = require('./routes/cadastro_estabelecimento.router.js')
app.use('/v1/ecoleta/cadastro/estabelecimento', cadastroEstabelecimento)

// ================= LOGIN ESTABELECIMENTO =================
const loginEstabelecimento = require('./routes/login_estabelecimento.router.js')
app.use('/v1/ecoleta/login/estabelecimento', loginEstabelecimento)

// // ================= HOME ESTABELECIMENTO =================
// const homeEstabelecimento = require('./routes/home_estabelecimento.js')
// app.use('/v1/ecoleta/estabelecimento/home', homeEstabelecimento)




// ================= EMAIL =================
const emailRouter = require('./routes/email.router.js')
app.use('/v1/ecoleta/email', emailRouter)

// ================= TELEFONE =================
const telefoneRouter = require('./routes/telefone.router.js')
app.use('/v1/ecoleta/telefone', telefoneRouter)

// ================= ESTADO =================
const estadoRouter = require('./routes/estado.router.js')
app.use('/v1/ecoleta/estado', estadoRouter)

// ================= CIDADE =================
const cidadeRouter = require('./routes/cidade.router.js')
app.use('/v1/ecoleta/cidade', cidadeRouter)

// ================= ENDERECO =================
const enderecoRouter = require('./routes/endereco.router.js')
app.use('/v1/ecoleta/endereco', enderecoRouter)

// ================= ESTABELECIMENTO =================
const estabelecimentoRouter = require('./routes/estabelecimento.router.js')
app.use('/v1/ecoleta/estabelecimento', estabelecimentoRouter)

// ================= START-API =================
app.listen(8000, function () {
    console.log('API aguardando novas requisições...')
})
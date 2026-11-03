/***************************************************************************************************************************
 * objetivo: Arquivo principal da API, responsável pelas configurações do Express, CORS, rotas e inicialização do servidor
 * data: 07/10/2026
 * autor: Gabriel Renato
 * versão: 1.0
***************************************************************************************************************************/

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
    methods: 'GET, POST, PUT, PATCH, OPTIONS', //Configuração dos verbos que serão ultilizados na API
    allowedHeaders: ['Content-type', 'Authorization'], //Configurações de permissões
    //                    └── Tipo de dados    └── Autorização de acesso
}

//Aplica as configurações do CORS no app (EXPRESS)
app.use(cors(corsOptions))

// =================
//     ENDPOINTS 
// =================

// TELA DE CADASTRO
// ================= CADASTRO ESTABELECIMENTO =================
const cadastroEstabelecimento = require('./routes/cadastro_estabelecimento/cadastro_estabelecimento.router.js')
app.use('/v1/ecoleta/cadastro/estabelecimento', cadastroEstabelecimento)


// TELA DE LOGIN
// ================= LOGIN ESTABELECIMENTO =================
const loginEstabelecimento = require('./routes/login_estabelecimento/login_estabelecimento.router.js')
app.use('/v1/ecoleta/login/estabelecimento', loginEstabelecimento)


// TELA HOME
// ================= HOME ESTABELECIMENTO =================
const homeEstabelecimento = require('./routes/home_estabelecimento/home_estabelecimento.router.js')
app.use('/v1/ecoleta/estabelecimento/home', homeEstabelecimento)


// TELA DE MEUS RESÍDUOS 
// ================= MEUS RESÍDUOS ESTABELECIMENTO =================
const meusResiduoEstabelecimento = require('./routes/meus_residuos_estabelecimento/meus_residuos_estabelecimento.router.js')
app.use('/v1/ecoleta/estabelecimento/meus-residuos', meusResiduoEstabelecimento)

// ================= MANIPULAR RESÍDUOS ESTABELECIMENTO =================
const residuoEstabelecimento = require('./routes/meus_residuos_estabelecimento/residuos_estabelecimento.router.js')
app.use('/v1/ecoleta/estabelecimento/residuos', residuoEstabelecimento)


// TELA DE COLETAS
// ================= MANIPULAR OFERTAS ESTABELECIMENTO =================
const ofertaEstabelecimento = require('./routes/coletas_estabelecimento/ofertas_estabelecimento.router.js')
app.use('/v1/ecoleta/estabelecimento/ofertas', ofertaEstabelecimento)

// ================= COLETAS ESTABELECIMENTO =================
const coletasEstabelecimento = require('./routes/coletas_estabelecimento/tela_coleta_estabelecimento.router.js')
app.use('/v1/ecoleta/estabelecimento/coletas', coletasEstabelecimento)


// TELA DE HISTÓRICO
// ================= HISTORICO ESTABELECIMENTO =================
const historicoEstabelecimento = require('./routes/historico_estabelecimento/historico_estabelecimento.router.js')
app.use('/v1/ecoleta/estabelecimento/historico', historicoEstabelecimento)


// TELA DE PERFIL
// ================= TELA DE PERFIL ESTABELECIMENTO =================
const perfilEstabelecimento = require('./routes/perfil_estabelecimento/perfil_estabelecimento.router.js')
app.use('/v1/ecoleta/estabelecimento/perfil', perfilEstabelecimento)






// ==========================
//     ENDPOINTS AUXILIARES
// ==========================

// ================= TIPO DE MATERIAL =================
const tipoMaterial = require('./routes/tipo_material/tipo_material_estabelecimento.router.js')
app.use('/v1/ecoleta/tipo-material', tipoMaterial)




// ================= EMAIL =================
const emailRouter = require('./routes/cadastro_estabelecimento/email.router.js')
app.use('/v1/ecoleta/email', emailRouter)

// ================= TELEFONE =================
const telefoneRouter = require('./routes/cadastro_estabelecimento/telefone.router.js')
app.use('/v1/ecoleta/telefone', telefoneRouter)

// ================= ESTADO =================
const estadoRouter = require('./routes/cadastro_estabelecimento/estado.router.js')
app.use('/v1/ecoleta/estado', estadoRouter)

// ================= CIDADE =================
const cidadeRouter = require('./routes/cadastro_estabelecimento/cidade.router.js')
app.use('/v1/ecoleta/cidade', cidadeRouter)

// ================= ENDERECO =================
const enderecoRouter = require('./routes/cadastro_estabelecimento/endereco.router.js')
app.use('/v1/ecoleta/endereco', enderecoRouter)

// ================= ESTABELECIMENTO =================
const estabelecimentoRouter = require('./routes/cadastro_estabelecimento/estabelecimento.router.js')
app.use('/v1/ecoleta/estabelecimento', estabelecimentoRouter)

// ================= START-API =================
app.listen(8000, function () {
    console.log('API aguardando novas requisições...')
})
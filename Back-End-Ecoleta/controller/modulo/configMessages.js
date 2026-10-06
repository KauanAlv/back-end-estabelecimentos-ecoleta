

//padronização dos retornos da API (cabeçalho)
const DEFAULT_MESSAGE = {
    api_descreiption: "api para controlar o fluxo do estabelecimento no ecoleta",
    development: "Gabriel Renato",
    version: "1.0.10.26",
    status: Boolean,
    status_code: Number,
    response: {}
}


//Mensagens de ERRO do projeto de filmes
const ERROR_BAD_REQUEST                 = { status: false, status_code: 400, message: "Não foi possível processar a requisição devido a erros de entrada de dados." }
const ERROR_NOT_FOUND                   = { status: false, status_code: 404, message: "Não foram encontrados dados para retorno." }
const ERROR_CONTENT_TYPE                = { status: false, status_code: 415, message: "Não foi possível processar a requisição pois o formato de dados encaminhado não é suportado pelo servidor. Deve-se ser utilizado apenas JSON." }
const ERROR_INTERNAL_SERVER_MODEL       = { status: false, status_code: 500, message: "Não foi possível processar a requisição devido a um erro interno no servidor [MODEL]." }
const ERROR_INTERNAL_SERVER_CONTROLLER  = { status: false, status_code: 500, message: "Não foi possível processar a requisição devido a um erro interno no servidor [CONTROLLER]." }

//Mensagens de SUCESSO do projeto de filmes
const SUCCESS_RESPONSE             = { status: true, status_code: 200}
const SUCCESS_UPDATED_ITEM         = { status: true, status_code: 200, message: "Item atualizado com sucesso" }
const SUCCESS_DELETED_ITEM         = { status: true, status_code: 200, message: "Item excluído com sucesso" }
const SUCCESS_CREATED_ITEM         = { status: true, status_code: 201, message: "Item inserido com sucesso" }
const SUCCESS_CREATED_ITEM_WARNING = { status: true, status_code: 201, message: "Item inserido com sucesso, porém alguns dados tiveram problemas no cadastro [dados de relacionamento]" }

module.exports = {
DEFAULT_MESSAGE,
ERROR_BAD_REQUEST,
ERROR_NOT_FOUND,
ERROR_CONTENT_TYPE,
ERROR_INTERNAL_SERVER_MODEL,
ERROR_INTERNAL_SERVER_CONTROLLER,
SUCCESS_RESPONSE,
SUCCESS_UPDATED_ITEM,
SUCCESS_DELETED_ITEM,
SUCCESS_CREATED_ITEM,
SUCCESS_CREATED_ITEM_WARNING
}
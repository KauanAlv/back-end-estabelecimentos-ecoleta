/***************************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas ao CADASTRO DO ESTABELECIMENTO
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
***************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../controller/modulo/configMessages.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const cadastroEstabelecimentoSchema = require('../../schema/cadastro_estabelecimento/schema_cadastro_estabelecimento.js')
const validarDados = require('../../utils/validarDados.js')

// IMPORT DA BIBLIOTECA PARA CRIPTOGRAFAR A SENHA
const bcrypt = require('bcrypt')

// IMPORT DAS DAOs
const emailDAO = require('../../model/DAO/cadastro_estabelecimento/email/email.js')
const telefoneDAO = require('../../model/DAO/cadastro_estabelecimento/telefone/telefone.js')
const estadoDAO = require('../../model/DAO/cadastro_estabelecimento/estado/estado.js')
const cidadeDAO = require('../../model/DAO/cadastro_estabelecimento/cidade/cidade.js')
const enderecoDAO = require('../../model/DAO/cadastro_estabelecimento/endereco/endereco.js')
const estabelecimentoDAO = require('../../model/DAO/cadastro_estabelecimento/estabelecimento/estabelecimento.js')

// IMPORT DA SERVICES
const distanciaService = require('../tabelas_auxiliares/distancia/services_distancia_estabelecimento.js')

// IMPORT DA FUNÇÃO DE GEOLOCALIZAÇÃO
const geolocalizacao = require('../../utils/geolocalizacao.js')

// IMPORT DA CONFIGRAÇÃO GLOBAL DO KNEX (PARA EXECUTAR A TRANSACTION)
const knexConection = require('../../model/global_knex/global_knex.js')

// Função para validar os dados do cadastro do estabelecimento
const validarDadosCadastroEstabelecimento = function (estabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(cadastroEstabelecimentoSchema, estabelecimento, customMessages)
}

const cadastrarEstabelecimentoService = async function (estabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let transaction

    try {
        let validacao = validarDadosCadastroEstabelecimento(estabelecimento)

        if (validacao) {
            return validacao
        }

        //Remove o hifen do cep
        estabelecimento.cep = estabelecimento.cep.replace('-','')

        //Normaliza o CNPJ
        estabelecimento.cnpj = estabelecimento.cnpj.trim().toUpperCase()

        // Verifica se esse CNPJ já existe no banco
        let empresaExistente = await estabelecimentoDAO.selectEstabelecimentoByCnpj(estabelecimento.cnpj)

        if (empresaExistente === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        if (empresaExistente.length > 0)
            return customMessages.ERROR_CONFLICT //  409, Dados já cadastrados

        // Prepara os dados do endereço
        let endereco = {
            numero: estabelecimento.numero_local,
            logradouro: estabelecimento.logradouro,
            bairro: estabelecimento.bairro,
            nome_cidade: estabelecimento.cidade,
            nome_estado: estabelecimento.nome_estado,
            cep: estabelecimento.cep
        }

        // Buscar as coordenadas antes de iniciar a transação
        let coordenadas = await geolocalizacao.buscarCoordenadasEndereco(endereco)

        // Valida se as coordenadas estão no padrão de uma coordenada
        if (
            !coordenadas ||
            typeof coordenadas.latitude !== 'number' ||
            typeof coordenadas.longitude !== 'number' ||
            !Number.isFinite(coordenadas.latitude) ||
            !Number.isFinite(coordenadas.longitude)
        ) {
            coordenadas = {
                latitude: null,
                longitude: null
            }
        }

        // Inicia a transação
        transaction = await knexConection.transaction()

        // Busca ou insere o estado
        let idEstado = await estadoDAO.insertOuSelectEstado(
            {
                sigla: estabelecimento.sigla_estado,
                nome_estado: estabelecimento.nome_estado
            },
            transaction
        )

        if (!idEstado)
            throw new Error('Não foi possível obter o ID do estado.')

        // Busca ou insere a cidade
        let idCidade = await cidadeDAO.insertOuSelectCidade(
            {
                nome_cidade: estabelecimento.cidade,
                id_estado: idEstado
            },
            transaction
        )

        if (!idCidade)
            throw new Error('Não foi possível obter o ID da cidade.')

        // Insere o e-mail
        let idEmail = await emailDAO.insertEmail(
            {
                email: estabelecimento.email
            },
            transaction
        )

        if (!idEmail)
            throw new Error('Não foi possível cadastrar o e-mail.')

        // Insere o telefone
        let idTelefone = await telefoneDAO.insertTelefone(
            {
                numero: estabelecimento.telefone
            },
            transaction
        )

        if (!idTelefone)
            throw new Error('Não foi possível cadastrar o telefone.')

        // Completa os dados do endereço
        endereco.latitude = coordenadas.latitude
        endereco.longitude = coordenadas.longitude
        endereco.id_cidade = idCidade

        // Insere o endereço
        let idEndereco = await enderecoDAO.insertEndereco(endereco, transaction)

        if (!idEndereco)
            throw new Error('Não foi possível cadastrar o endereço.')

        // Cria um hash para a senha
        let senhaHash = await bcrypt.hash(estabelecimento.senha, 12)

        // Preparar os dados do estabelecimento
        let dadosEstabelecimento = {
            nome: estabelecimento.nome_empresa,
            cnpj: estabelecimento.cnpj,
            senha_hash: senhaHash,
            id_email: idEmail,
            id_telefone: idTelefone,
            id_endereco: idEndereco
        }

        // Insere o estabelecimento
        let idEstabelecimento = await estabelecimentoDAO.insertEstabelecimento(dadosEstabelecimento, transaction)

        if (!idEstabelecimento)
            throw new Error('Não foi possível cadastrar o estabelecimento.')

        // Confirmar todas as operações
        await transaction.commit()

        // Calcula as distâncias do novo estabelecimento
        let resultadoDistancias = await distanciaService.calcularDistanciasNovoEstabelecimento(idEstabelecimento)

        if (!resultadoDistancias) {
            console.error('Não foi possível cadastrar todas as distâncias do estabelecimento.')
        }

        // Prepara a resposta
        let resposta = {
            id: idEstabelecimento,
            nome_empresa: estabelecimento.nome_empresa,
            cnpj: estabelecimento.cnpj
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
        customMessages.DEFAULT_MESSAGE.message = 'Estabelecimento cadastrado com sucesso.'
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE // 201, item criado

    } catch (error) {

        // Desfaz as operações se a transação ainda estiver ativa
        if (transaction && !transaction.isCompleted())
            await transaction.rollback()

        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062)
            return customMessages.ERROR_CONFLICT

        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

module.exports = {
    cadastrarEstabelecimentoService
}
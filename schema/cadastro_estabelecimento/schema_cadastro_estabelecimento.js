/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados do CADASTRO DO ESTABELECIMENTO
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
*************************************************************************************/

const Joi = require('joi')
const validarCNPJ = require('../../utils/validarDados.js')

const cadastroEstabelecimentoSchema = Joi.object({
    nome_empresa: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.empty': 'O campo Nome da Empresa não pode ficar vazio.',
            'string.max': 'O Nome da Empresa deve possuir no máximo 100 caracteres.',
            'any.required': 'O campo Nome da Empresa é obrigatório.',
            'string.base': 'O Nome da Empresa deve ser um texto.'
        }),

    cnpj: Joi.string()
        .trim()
        .max(25)
        // O custom permite criar uma validação própria, além do JOI
        // O value é o valor que está sendo validado e o helpers é algo do JOI que contém funções auxiliares, como a que informa que a validação falhou
        .custom((value, helpers) => {
            if (!validarCNPJ.validarCNPJ(value)) {
                return helpers.error('string.cnpj')
            }
            return value.toUpperCase()
        })
        .required()
        .messages({
            'string.empty': 'O campo CNPJ não pode ficar vazio.',
            'string.max': 'O CNPJ deve possuir no máximo 25 caracteres.',
            'string.cnpj': 'O CNPJ informado é inválido.',
            'any.required': 'O campo CNPJ é obrigatório.',
            'string.base': 'O CNPJ deve ser um texto.'
        }),

    cep: Joi.string()
        .trim()
        .pattern(/^\d{5}-?\d{3}$/)
        .max(12)
        .required()
        .messages({
            'string.empty': 'O campo CEP não pode ficar vazio.',
            'string.pattern.base': 'O CEP deve possuir 8 dígitos, com ou sem hífen.',
            'string.max': 'O CEP deve possuir no máximo 12 caracteres.',
            'any.required': 'O campo CEP é obrigatório.',
            'string.base': 'O CEP deve ser um texto.'
        }),

    logradouro: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.empty': 'O campo logradouro não pode ficar vazio.',
            'string.max': 'O logradouro deve possuir no máximo 100 caracteres.',
            'any.required': 'O campo logradouro é obrigatório.',
            'string.base': 'O logradouro deve ser um texto.'
        }),

    bairro: Joi.string()
        .trim()
        .max(80)
        .required()
        .messages({
            'string.empty': 'O campo bairro não pode ficar vazio.',
            'string.max': 'O bairro deve possuir no máximo 80 caracteres.',
            'any.required': 'O campo bairro é obrigatório.',
            'string.base': 'O bairro deve ser um texto.'
        }),

    cidade: Joi.string()
        .trim()
        .max(60)
        .required()
        .messages({
            'string.empty': 'O campo Cidade não pode ficar vazio.',
            'string.max': 'A Cidade deve possuir no máximo 60 caracteres.',
            'any.required': 'O campo Cidade é obrigatório.',
            'string.base': 'A Cidade deve ser um texto.'
        }),

    nome_estado: Joi.string()
        .trim()
        .max(30)
        .required()
        .messages({
            'string.empty': 'O campo Nome do Estado não pode ficar vazio.',
            'string.max': 'O Nome do Estado deve possuir no máximo 30 caracteres.',
            'any.required': 'O campo Nome do Estado é obrigatório.',
            'string.base': 'O Nome do Estado deve ser um texto.'
        }),

    sigla_estado: Joi.string()
        .trim()
        .uppercase()
        .length(2)
        .required()
        .messages({
            'string.empty': 'A Sigla do Estado não pode ficar vazia.',
            'string.length': 'A Sigla do Estado deve possuir exatamente 2 caracteres.',
            'any.required': 'O campo Sigla do Estado é obrigatório.',
            'string.base': 'A Sigla do Estado deve ser um texto.'
        }),

    numero_local: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'O Número do endereço deve ser um número.',
            'number.integer': 'O Número do endereço deve ser um número inteiro.',
            'number.min': 'O Número do endereço deve ser maior que zero.',
            'any.required': 'O Número do endereço é obrigatório.'
        }),

    email: Joi.string()
        .trim()
        .max(256)
        .email()
        .required()
        .messages({
            'string.empty': 'O campo E-mail não pode ficar vazio.',
            'string.max': 'O E-mail deve possuir no máximo 256 caracteres.',
            'string.email': 'O E-mail informado é inválido.',
            'any.required': 'O campo E-mail é obrigatório.',
            'string.base': 'O E-mail deve ser um texto.'
        }),

    telefone: Joi.string()
        .trim()
        .pattern(/^[0-9]+$/)
        .max(25)
        .required()
        .messages({
            'string.empty': 'O campo Telefone não pode ficar vazio.',
            'string.max': 'O Telefone deve possuir no máximo 25 caracteres.',
            'any.required': 'O campo Telefone é obrigatório.',
            'string.base': 'O Telefone deve ser um texto.',
            'string.pattern.base': 'O Telefone deve conter apenas números, sem espaços ou símbolos.'
        }),

    senha: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            'string.empty': 'O campo Senha não pode ficar vazio.',
            'string.min': 'A Senha deve possuir no mínimo 8 caracteres.',
            'string.max': 'A Senha deve possuir no máximo 30 caracteres.',
            'any.required': 'O campo Senha é obrigatório.',
            'string.base': 'A Senha deve ser um texto.'
        })
})

module.exports = cadastroEstabelecimentoSchema
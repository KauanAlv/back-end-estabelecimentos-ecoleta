/*************************************************************************
 * Objetivo: Arquivo responsável por validar os dados do ESTABELECIMENTO
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
*************************************************************************/

const Joi = require('joi')

const estabelecimentoSchema = Joi.object({
    nome: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.empty': 'O campo Nome não pode ficar vazio.',
            'string.max': 'O Nome deve possuir no máximo 100 caracteres.',
            'any.required': 'O campo Nome é obrigatório.',
            'string.base': 'O Nome deve ser um texto.'
        }),

    cnpj: Joi.string()
        .trim()
        .max(25)
        .required()
        .messages({
            'string.empty': 'O campo CNPJ não pode ficar vazio.',
            'string.max': 'O CNPJ deve possuir no máximo 25 caracteres.',
            'any.required': 'O campo CNPJ é obrigatório.',
            'string.base': 'O CNPJ deve ser um texto.'
        }),

    senha: Joi.string()
        .trim()
        .min(8)
        .max(30)
        .required()
        .messages({
            'string.empty': 'O campo Senha não pode ficar vazio.',
            'string.min': 'A Senha deve possuir no mínimo 8 caracteres.',
            'string.max': 'A Senha deve possuir no máximo 30 caracteres.',
            'any.required': 'O campo Senha é obrigatório.',
            'string.base': 'A Senha deve ser um texto.'
        }),

    id_email: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'O ID do e-mail deve ser um número.',
            'number.integer': 'O ID do e-mail deve ser um número inteiro.',
            'number.min': 'O ID do e-mail deve ser maior que zero.',
            'any.required': 'O ID do e-mail é obrigatório.'
        }),

    id_telefone: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'O ID do telefone deve ser um número.',
            'number.integer': 'O ID do telefone deve ser um número inteiro.',
            'number.min': 'O ID do telefone deve ser maior que zero.',
            'any.required': 'O ID do telefone é obrigatório.'
        }),

    id_endereco: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'O ID do endereço deve ser um número.',
            'number.integer': 'O ID do endereço deve ser um número inteiro.',
            'number.min': 'O ID do endereço deve ser maior que zero.',
            'any.required': 'O ID do endereço é obrigatório.'
        })
})

module.exports = estabelecimentoSchema
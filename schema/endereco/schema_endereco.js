/*****************************************************************
 * Objetivo: Arquivo responsável por validar os dados do ENDEREÇO
 * Data: 16/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
*****************************************************************/

const Joi = require('joi')

const enderecoSchema = Joi.object({
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

    numero: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'O número deve ser um número.',
            'number.integer': 'O número deve ser um número inteiro.',
            'number.min': 'O número deve ser maior que zero.',
            'any.required': 'O campo número é obrigatório.'
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

    nome_cidade: Joi.string()
        .trim()
        .max(60)
        .required()
        .messages({
            'string.empty': 'O campo Nome da Cidade não pode ficar vazio.',
            'string.max': 'O Nome da Cidade deve possuir no máximo 60 caracteres.',
            'any.required': 'O campo Nome da Cidade é obrigatório.',
            'string.base': 'O Nome da Cidade deve ser um texto.'
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
        .max(3)
        .required()
        .messages({
            'string.empty': 'A sigla do estado não pode ficar vazia.',
            'string.max': 'A sigla do estado deve possuir no máximo 3 caracteres.',
            'any.required': 'O campo sigla do estado é obrigatório.',
            'string.base': 'A sigla do estado deve ser um texto.'
        }),

    id_cidade: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'O ID da Cidade deve ser um número.',
            'number.integer': 'O ID da Cidade deve ser um número inteiro.',
            'number.min': 'O ID da Cidade deve ser maior que zero.',
            'any.required': 'O campo ID da Cidade é obrigatório.'
        })
})

module.exports = enderecoSchema
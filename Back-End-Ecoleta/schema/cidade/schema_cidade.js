/**************************************************************
 * Objetivo: Arquivo responsável por validar os dados da CIDADE
 * Data: 20/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
**************************************************************/

const Joi = require('joi')

const cidadeSchema = Joi.object({
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

    id_estado: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'O ID do Estado deve ser um número.',
            'number.integer': 'O ID do Estado deve ser um número inteiro.',
            'number.min': 'O ID do Estado deve ser maior que zero.',
            'any.required': 'O campo ID do Estado é obrigatório.'
        })
})

module.exports = cidadeSchema
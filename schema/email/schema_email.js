/*****************************************************************
 * Objetivo: Arquivo responsável por validar os dados do EMAIL
 * Data: 16/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
*****************************************************************/


const Joi = require('joi')

const emailSchema = Joi.object({
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
        })
})

module.exports = emailSchema
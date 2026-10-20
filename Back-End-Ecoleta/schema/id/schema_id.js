/**************************************************************
 * Objetivo: Arquivo responsável por validar o ID recebido
 * Data: 20/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
**************************************************************/

const Joi = require('joi')

const idSchema = Joi.object({
    id: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'O ID deve ser um número.',
            'number.integer': 'O ID deve ser um número inteiro.',
            'number.min': 'O ID deve ser maior que zero.',
            'any.required': 'O campo ID é obrigatório.'
        })
})

module.exports = idSchema
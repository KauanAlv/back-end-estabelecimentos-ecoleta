/*****************************************************************
 * Objetivo: Arquivo responsável por validar os dados do TELEFONE
 * Data: 16/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
*****************************************************************/

const Joi = require('joi')

const telefoneSchema = Joi.object({
    numero: Joi.string()
        .trim()
        .pattern(/^[0-9]+$/)
        .max(25)
        .required()
        .messages({
            'string.empty': 'O campo Número não pode ficar vazio.',
            'string.max': 'O Número deve possuir no máximo 25 caracteres.',
            'any.required': 'O campo Número é obrigatório.',
            'string.base': 'O Número deve ser um texto.',
            'string.pattern.base': 'O campo Número deve conter apenas números, sem espaços ou símbolos.'
        })
})

module.exports = telefoneSchema
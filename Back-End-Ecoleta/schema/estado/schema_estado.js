/**************************************************************
 * Objetivo: Arquivo responsável por validar os dados do ESTADO
 * Data: 20/10/2026 - (terça-feira)
 * Autor: Gabriel Renato
 * Versão: 1.0
**************************************************************/

const Joi = require('joi')

const estadoSchema = Joi.object({
    sigla: Joi.string()
        .trim()
        .max(3)
        .required()
        .uppercase()
        .messages({
            'string.empty': 'O campo Sigla não pode ficar vazio.',
            'string.max': 'A Sigla deve possuir no máximo 3 caracteres.',
            'any.required': 'O campo Sigla é obrigatório.',
            'string.base': 'A Sigla deve ser um texto.'
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
        })
})

module.exports = estadoSchema
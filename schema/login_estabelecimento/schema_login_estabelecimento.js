/**********************************************************************************
 * Objetivo: Arquivo responsável por validar os dados de LOGIN DO ESTABELECIMENTO
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
**********************************************************************************/

const Joi = require('joi')

const loginEstabelecimentoSchema = Joi.object({
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
        .required()
        .messages({
            'string.empty': 'O campo Senha não pode ficar vazio.',
            'any.required': 'O campo Senha é obrigatório.',
            'string.base': 'A Senha deve ser um texto.'
        })
})

module.exports = loginEstabelecimentoSchema
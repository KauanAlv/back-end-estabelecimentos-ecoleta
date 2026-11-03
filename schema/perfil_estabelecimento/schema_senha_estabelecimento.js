/***********************************************************************************
 * Objetivo: Arquivo responsável por validar os dados da SENHA DO ESTABELECIMENTO
 * Data: 03/11/2026 - (terça-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
************************************************************************************/

const Joi = require('joi')

const alterarSenhaEstabelecimentoSchema = Joi.object({
    senha_atual: Joi.string()
        .required()
        .messages({
            'string.empty': 'O campo Senha Atual não pode ficar vazio.',
            'any.required': 'O campo Senha Atual é obrigatório.',
            'string.base': 'A Senha Atual deve ser um texto.'
        }),

    nova_senha: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            'string.empty': 'O campo Nova Senha não pode ficar vazio.',
            'string.min': 'A Nova Senha deve possuir no mínimo 8 caracteres.',
            'string.max': 'A Nova Senha deve possuir no máximo 30 caracteres.',
            'any.required': 'O campo Nova Senha é obrigatório.',
            'string.base': 'A Nova Senha deve ser um texto.'
        }),

    confirmar_senha: Joi.string()
        .valid(Joi.ref('nova_senha'))
        .required()
        .messages({
            'string.empty': 'O campo Confirmar Senha não pode ficar vazio.',
            'any.only': 'A confirmação da senha deve ser igual à nova senha.',
            'any.required': 'O campo Confirmar Senha é obrigatório.',
            'string.base': 'A confirmação da senha deve ser um texto.'
        })
})

module.exports = alterarSenhaEstabelecimentoSchema

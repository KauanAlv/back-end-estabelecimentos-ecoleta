/******************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados da OFERTA ACEITA DO ESTABELECIMENTO
 * Data: 30/10/2026 - (sexta - feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
******************************************************************************************/

const Joi = require('joi')

const aceitarOfertaSchema = Joi.object({
    nome_aceitante: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            'string.empty': 'O campo Nome do Funcionário não pode ficar vazio.',
            'string.max': 'O Nome do Funcionário deve possuir no máximo 100 caracteres.',
            'any.required': 'O campo Nome do Funcionário é obrigatório.',
            'string.base': 'O Nome do Funcionário deve ser um texto.'
        })
})

module.exports = aceitarOfertaSchema
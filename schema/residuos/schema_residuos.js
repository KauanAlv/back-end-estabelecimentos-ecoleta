/****************************************************************
 * Objetivo: Arquivo responsável por validar os dados do RESÍDUO
 * Data: 28/10/2026 - (quarta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
****************************************************************/

const Joi = require('joi')

const cadastroResiduoSchema = Joi.object({
    horario_inicial: Joi.string()
        .pattern(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
        .required()
        .messages({
            'string.empty': 'O campo Horário Inicial não pode ficar vazio.',
            'string.pattern.base': 'O Horário Inicial deve estar no formato HH:mm ou HH:mm:ss.',
            'any.required': 'O campo Horário Inicial é obrigatório.',
            'string.base': 'O Horário Inicial deve ser um texto.'
        }),

    horario_final: Joi.string()
        .pattern(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
        .required()
        .messages({
            'string.empty': 'O campo Horário Final não pode ficar vazio.',
            'string.pattern.base': 'O Horário Final deve estar no formato HH:mm ou HH:mm:ss.',
            'any.required': 'O campo Horário Final é obrigatório.',
            'string.base': 'O Horário Final deve ser um texto.'
        }),

    quantidade: Joi.number()
        .positive()
        .precision(2)
        .max(9999.99)
        .strict()
        .required()
        .messages({
            'number.base': 'A Quantidade deve ser um número.',
            'number.positive': 'A Quantidade deve ser maior que zero.',
            'number.precision': 'A Quantidade deve possuir no máximo 2 casas decimais.',
            'number.max': 'A Quantidade deve ser de no máximo 9.999,99.',
            'any.required': 'O campo Quantidade é obrigatório.'
        }),

    data_disponivel: Joi.string()
        .pattern(/^\d{2}\/\d{2}\/\d{4}$/)
        .custom((value, helpers) => {
            let [dia, mes, ano] = value.split('/').map(Number)
            let data = new Date(Date.UTC(ano, mes - 1, dia))

            if (
                data.getUTCFullYear() !== ano ||
                data.getUTCMonth() + 1 !== mes ||
                data.getUTCDate() !== dia
            )
                return helpers.error('any.invalid')

            return value
        })
        .required()
        .messages({
            'string.empty': 'O campo Data Disponível não pode ficar vazio.',
            'string.pattern.base': 'A Data Disponível deve estar no formato DD/MM/AAAA.',
            'any.invalid': 'A Data Disponível é inválida.',
            'any.required': 'O campo Data Disponível é obrigatório.',
            'string.base': 'A Data Disponível deve ser um texto.'
        }),

    observacao: Joi.string()
        .trim()
        .allow('', null)
        .optional()
        .messages({
            'string.base': 'A Observação deve ser um texto.'
        }),

    id_tipo_material: Joi.number()
        .integer()
        .positive()
        .strict()
        .required()
        .messages({
            'number.base': 'O ID do Tipo de Material deve ser um número.',
            'number.integer': 'O ID do Tipo de Material deve ser um número inteiro.',
            'number.positive': 'O ID do Tipo de Material deve ser maior que zero.',
            'any.required': 'O campo Tipo de Material é obrigatório.'
        })
}).custom((value, helpers) => {

    // Função para converter um horário em segundos
    const converterHorarioParaSegundos = function (horario) {
        let [horas, minutos, segundos = 0] = horario.split(':').map(Number)

        return horas * 3600 + minutos * 60 + segundos
    }

    // Converte os horários para segundos
    let horarioInicial = converterHorarioParaSegundos(value.horario_inicial)
    let horarioFinal = converterHorarioParaSegundos(value.horario_final)

    // Impede horários iguais ou horário final anterior ao inicial
    if (horarioFinal <= horarioInicial)
        return helpers.error('any.invalid')

    return value

}).messages({
    'any.invalid': 'O Horário Final deve ser posterior ao Horário Inicial.'
})

module.exports = cadastroResiduoSchema
/******************************************************************
 * Objetivo: Arquivo responsável por criar e validar os tokens JWT
 * Data: 23/10/2026 - (sexta-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
******************************************************************/

// IMPORTE DA BIBLIOTECA JWT
const jwt = require('jsonwebtoken')

// Chave secreta para assinar os tokens
const SECRET = process.env.JWT_SECRET

// Calcula os segundos até a próxima meia-noite
const calcularTempoExpiracao = function () {
    let horarioAtual = new Date()

    // Define a próxima meia-noite
    let meiaNoite = new Date(horarioAtual)
    meiaNoite.setHours(24, 0, 0, 0) // Define 00:00 do dia seguinte

    // Calcula a diferença em segundos
    /******
    * Math.ceil() - arredonda o resultado para cima
    * getTime() obtém os horários em milissegundos
    * / 1000 converte esse tempo para segundos
    ******/
    return Math.ceil((meiaNoite.getTime() - horarioAtual.getTime()) / 1000)
}

// Cria o token JWT
const createJWT = function (idEstabelecimento) {

    // Calcula o tempo de validade do token na hora do login
    const EXPIRES = calcularTempoExpiracao()

    // Gera o token com o ID da empresa
    const token = jwt.sign(
        { id_estabelecimento: idEstabelecimento },
        SECRET,
        {
            expiresIn: EXPIRES,
            algorithm: 'HS256'
        }
    )

    return token
}

// Valida o token JWT
const validateJWT = function (token) {
    try {
        // Verifica a assinatura e a validade
        return jwt.verify(token, SECRET, {
            algorithms: ['HS256']
        })

    } catch (error) {
        return false
    }
}

module.exports = {
    createJWT,
    validateJWT
}
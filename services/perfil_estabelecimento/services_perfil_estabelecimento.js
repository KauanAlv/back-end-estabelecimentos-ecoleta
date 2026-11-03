/***************************************************************************************************************
 * Objetivo: Arquivo responsável por executar as regras de negócio relacionadas ao PERFIL DO ESTABELECIMENTO
 * Data: 03/11/2026 - (terça-feira)
 * Autor: Kauan Alves Pereira
 * Versão: 1.0
***************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../controller/modulo/configMessages.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const perfilEstabelecimentoSchema = require('../../schema/perfil_estabelecimento/schema_perfil_estabelecimento.js')
const alterarSenhaEstabelecimentoSchema = require('../../schema/perfil_estabelecimento/schema_senha_estabelecimento.js')
const validarDados = require('../../utils/validarDados.js')

// IMPORT DAS DAOs
const perfilEstabelecimentoDAO = require('../../model/DAO/perfil_estabelecimento/perfil_estabelecimento.js')
const estadoDAO = require('../../model/DAO/cadastro_estabelecimento/estado/estado.js')
const cidadeDAO = require('../../model/DAO/cadastro_estabelecimento/cidade/cidade.js')

// IMPORT DA FUNÇÃO DE GEOLOCALIZAÇÃO
const geolocalizacao = require('../../utils/geolocalizacao.js')

// IMPORT DA BIBLIOTECA PARA CRIPTOGRAFAR A SENHA
const bcrypt = require('bcrypt')

// IMPORT DA CONFIGURAÇÃO GLOBAL DO KNEX
const knexConection = require('../../model/global_knex/global_knex.js')

// Função para validar os dados de atualização do perfil
const validarDadosPerfilEstabelecimento = function (estabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(
        perfilEstabelecimentoSchema,
        estabelecimento,
        customMessages
    )
}

// Função para validar os dados da alteração de senha
const validarDadosAlterarSenhaEstabelecimento = function (dadosSenha) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDadosGeral(
        alterarSenhaEstabelecimentoSchema,
        dadosSenha,
        customMessages
    )
}

// Função para buscar os dados do perfil do estabelecimento
const buscarPerfilEstabelecimentoService = async function (idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        // Valida o ID do estabelecimento autenticado
        let validarEstabelecimento = validarDados.validarId(idEstabelecimento, customMessages)

        if (validarEstabelecimento)
            return validarEstabelecimento

        // Consulta os dados do perfil
        let result = await perfilEstabelecimentoDAO.selectByIdPerfilEstabelecimento(idEstabelecimento)

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.perfil = result

                return customMessages.DEFAULT_MESSAGE // 200
            } else {
                return customMessages.ERROR_NOT_FOUND // 404, não encontrado
            }
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para atualizar os dados do perfil do estabelecimento
const atualizarPerfilEstabelecimentoService = async function (estabelecimento, idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let transaction

    try {
        // Valida os dados enviados para atualização
        let validacao = validarDadosPerfilEstabelecimento(estabelecimento)

        if (validacao)
            return validacao

        // Valida o ID do estabelecimento autenticado
        let validarEstabelecimento = validarDados.validarId(idEstabelecimento, customMessages)

        if (validarEstabelecimento)
            return validarEstabelecimento

        // Consulta os dados atuais do perfil
        let perfilAtual = await perfilEstabelecimentoDAO.selectByIdPerfilEstabelecimento(idEstabelecimento)

        if (perfilAtual === false)
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

        if (perfilAtual.length === 0)
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado

        let dadosAtuais = perfilAtual[0]

        // Remove o hífen do CEP
        estabelecimento.cep = estabelecimento.cep.replace('-', '')

        // Verifica se os dados do endereço foram alterados
        let enderecoAlterado =
            dadosAtuais.cep.replace(/\D/g, '') !== estabelecimento.cep ||
            dadosAtuais.numero !== estabelecimento.numero_local ||
            dadosAtuais.logradouro !== estabelecimento.logradouro ||
            dadosAtuais.bairro !== estabelecimento.bairro ||
            dadosAtuais.nome_cidade !== estabelecimento.cidade ||
            dadosAtuais.nome_estado !== estabelecimento.nome_estado ||
            dadosAtuais.sigla !== estabelecimento.sigla_estado

        let coordenadas = null
        let empresasColetoras = []
        let distanciasCalculadas = []

        if (enderecoAlterado) {

            // Prepara os dados para consultar a API de geolocalização
            let endereco = {
                numero: estabelecimento.numero_local,
                logradouro: estabelecimento.logradouro,
                bairro: estabelecimento.bairro,
                nome_cidade: estabelecimento.cidade,
                nome_estado: estabelecimento.nome_estado,
                cep: estabelecimento.cep
            }

            // Busca as novas coordenadas antes da transação
            coordenadas = await geolocalizacao.buscarCoordenadasEndereco(endereco)

            // Verifica se a API retornou coordenadas válidas
            if (
                !coordenadas ||
                typeof coordenadas.latitude !== 'number' ||
                typeof coordenadas.longitude !== 'number' ||
                !Number.isFinite(coordenadas.latitude) ||
                !Number.isFinite(coordenadas.longitude)
            ) {
                customMessages.ERROR_CONFLICT.message = 'Não foi possível localizar o novo endereço. Nenhum dado foi alterado.'
                return customMessages.ERROR_CONFLICT // 409, conflito
            }

            // Consulta as empresas coletoras vinculadas ao estabelecimento
            empresasColetoras = await perfilEstabelecimentoDAO.selectEmpresasColetorasPerfilEstabelecimento(idEstabelecimento)

            if (empresasColetoras === false)
                return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model

            // Calcula as novas distâncias antes da transação
            for (let empresaColetora of empresasColetoras) {

                let destino = {
                    latitude: empresaColetora.latitude,
                    longitude: empresaColetora.longitude
                }

                let distancia = await geolocalizacao.calcularDistancia(coordenadas, destino)

                // Se não conseguir calcular a distância, armazena null
                if (distancia === null || !Number.isFinite(distancia)) {
                    distancia = null
                }

                distanciasCalculadas.push({
                    id_distancia: empresaColetora.id_distancia,
                    id_empresa_coletora: empresaColetora.id_empresa_coletora,
                    distancia: distancia
                })
            }
        }

        // Inicia a transação
        transaction = await knexConection.transaction()

        // Consulta e bloqueia os dados atuais do estabelecimento
        let perfilBloqueado = await perfilEstabelecimentoDAO.selectPerfilEstabelecimentoForUpdate(idEstabelecimento, transaction)

        if (perfilBloqueado === false)
            throw new Error('Não foi possível consultar os dados do estabelecimento.')

        if (perfilBloqueado.length === 0) {
            await transaction.rollback()
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado
        }

        let dadosBloqueados = perfilBloqueado[0]

        // Verifica se o endereço não foi alterado por outra requisição
        if (
            dadosBloqueados.cep !== dadosAtuais.cep ||
            dadosBloqueados.numero !== dadosAtuais.numero ||
            dadosBloqueados.id_cidade !== dadosAtuais.id_cidade
        ) {
            await transaction.rollback()

            customMessages.ERROR_CONFLICT.message = 'Os dados do endereço foram alterados. Consulte o perfil novamente.'
            return customMessages.ERROR_CONFLICT // 409, conflito
        }

        // Utiliza as coordenadas existentes quando o endereço não mudou
        if (!enderecoAlterado) {
            coordenadas = {
                latitude: dadosBloqueados.latitude,
                longitude: dadosBloqueados.longitude
            }
        }

        // Se o endereço mudou, verifica as ligações antes de atualizar
        if (enderecoAlterado) {

            let empresasColetorasAtuais =
                await perfilEstabelecimentoDAO.selectEmpresasColetorasPerfilEstabelecimento(idEstabelecimento, transaction)

            if (empresasColetorasAtuais === false)
                throw new Error('Não foi possível conferir as distâncias cadastradas.')

            // Confere se o conjunto de ligações continua o mesmo
            if (empresasColetorasAtuais.length !== empresasColetoras.length) {
                await transaction.rollback()

                customMessages.ERROR_CONFLICT.message = 'As ligações de distância foram alteradas. Tente novamente.'
                return customMessages.ERROR_CONFLICT // 409, conflito
            }

            // Verifica se as empresas coletoras e suas coordenadas continuam iguais
            for (let empresaColetoraAnterior of empresasColetoras) {

                // Procura a mesma empresa coletora na consulta realizada dentro da transação
                let empresaColetoraAtual = empresasColetorasAtuais.find(
                    empresaColetora => empresaColetora.id_distancia === empresaColetoraAnterior.id_distancia
                )

                // Verifica se a ligação ainda existe e se os dados continuam iguais
                if (
                    !empresaColetoraAtual ||
                    empresaColetoraAtual.id_empresa_coletora !== empresaColetoraAnterior.id_empresa_coletora ||
                    String(empresaColetoraAtual.latitude) !== String(empresaColetoraAnterior.latitude) ||
                    String(empresaColetoraAtual.longitude) !== String(empresaColetoraAnterior.longitude)
                ) {
                    await transaction.rollback()

                    customMessages.ERROR_CONFLICT.message = 'Os endereços vinculados foram alterados. Tente novamente.'
                    return customMessages.ERROR_CONFLICT // 409, conflito
                }
            }
        }

        // Busca ou insere o estado
        let idEstado = await estadoDAO.insertOuSelectEstado(
            {
                sigla: estabelecimento.sigla_estado,
                nome_estado: estabelecimento.nome_estado
            },
            transaction
        )

        if (!idEstado)
            throw new Error('Não foi possível obter o ID do estado.')

        // Busca ou insere a cidade
        let idCidade = await cidadeDAO.insertOuSelectCidade(
            {
                nome_cidade: estabelecimento.cidade,
                id_estado: idEstado
            },
            transaction
        )

        if (!idCidade)
            throw new Error('Não foi possível obter o ID da cidade.')

        // Prepara os dados para atualização
        let dadosPerfil = {
            nome_empresa: estabelecimento.nome_empresa,
            telefone: estabelecimento.telefone,
            email: estabelecimento.email,
            cep: estabelecimento.cep,
            logradouro: estabelecimento.logradouro,
            numero: estabelecimento.numero_local,
            bairro: estabelecimento.bairro,
            latitude: coordenadas.latitude,
            longitude: coordenadas.longitude,
            id_cidade: idCidade
        }

        // Atualiza os dados do estabelecimento
        let resultadoAtualizacao =
            await perfilEstabelecimentoDAO.updatePerfilEstabelecimento(
                dadosPerfil,
                idEstabelecimento,
                transaction
            )

        if (resultadoAtualizacao === false)
            throw new Error('Não foi possível atualizar o perfil do estabelecimento.')

        // Atualiza as distâncias somente quando o endereço foi alterado
        if (enderecoAlterado) {

            for (let registro of distanciasCalculadas) {

                let resultadoDistancia =
                    await perfilEstabelecimentoDAO.updateDistanciaPerfilEstabelecimento(
                        registro,
                        idEstabelecimento,
                        transaction
                    )

                if (resultadoDistancia === false)
                    throw new Error('Não foi possível atualizar uma das distâncias.')
            }
        }

        // Confirma todas as atualizações
        await transaction.commit()

        // Prepara a resposta
        let resposta = {
            id_estabelecimento: idEstabelecimento,
            nome_empresa: estabelecimento.nome_empresa,
            telefone: estabelecimento.telefone,
            email: estabelecimento.email,
            cep: estabelecimento.cep,
            logradouro: estabelecimento.logradouro,
            numero: estabelecimento.numero_local,
            bairro: estabelecimento.bairro,
            cidade: estabelecimento.cidade,
            nome_estado: estabelecimento.nome_estado,
            sigla_estado: estabelecimento.sigla_estado
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATED_ITEM.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATED_ITEM.status_code
        customMessages.DEFAULT_MESSAGE.message = 'Perfil atualizado com sucesso.'
        customMessages.DEFAULT_MESSAGE.response = resposta

        return customMessages.DEFAULT_MESSAGE // 200

    } catch (error) {
        // Desfaz as operações se a transação ainda estiver ativa
        if (transaction && !transaction.isCompleted())
            await transaction.rollback()

        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062)
            return customMessages.ERROR_CONFLICT

        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

// Função para alterar a senha do estabelecimento
const alterarSenhaEstabelecimentoService = async function (dadosSenha, idEstabelecimento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let transaction

    try {
        // Valida os dados da alteração de senha
        let validacao = validarDadosAlterarSenhaEstabelecimento(dadosSenha)

        if (validacao)
            return validacao

        // Valida o ID do estabelecimento autenticado
        let validarEstabelecimento = validarDados.validarId(idEstabelecimento, customMessages)

        if (validarEstabelecimento)
            return validarEstabelecimento

        // Inicia a transação
        transaction = await knexConection.transaction()

        // Consulta e bloqueia a senha atual do estabelecimento
        let estabelecimentoAtual = await perfilEstabelecimentoDAO.selectSenhaEstabelecimentoForUpdate(
            idEstabelecimento,
            transaction
        )

        if (estabelecimentoAtual === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        if (estabelecimentoAtual.length === 0) {
            await transaction.rollback()
            return customMessages.ERROR_NOT_FOUND // 404, não encontrado
        }

        // Verifica se a senha atual informada corresponde ao hash armazenado
        let senhaCorreta = await bcrypt.compare(
            dadosSenha.senha_atual,
            estabelecimentoAtual[0].senha_hash
        )

        // Impede a alteração se a senha atual estiver incorreta
        if (!senhaCorreta) {
            await transaction.rollback()

            customMessages.ERROR_CONFLICT.message = 'A senha atual informada está incorreta.'
            return customMessages.ERROR_CONFLICT // 409, senha atual incorreta
        }

        // Verifica se a nova senha é diferente da senha atual
        let senhaIgual = await bcrypt.compare(dadosSenha.nova_senha, estabelecimentoAtual[0].senha_hash)

        if (senhaIgual) {
            await transaction.rollback()

            customMessages.ERROR_CONFLICT.message = 'A nova senha deve ser diferente da senha atual.'
            return customMessages.ERROR_CONFLICT // 409, nova senha igual à atual
        }

        // Gera o hash da nova senha
        let novaSenhaHash = await bcrypt.hash(dadosSenha.nova_senha, 12)

        // Atualiza somente a senha do estabelecimento
        let resultadoAtualizacao = await perfilEstabelecimentoDAO.updateSenhaEstabelecimento(
            idEstabelecimento,
            novaSenhaHash,
            estabelecimentoAtual[0].senha_hash,
            transaction
        )

        if (resultadoAtualizacao === false) {
            await transaction.rollback()
            return customMessages.ERROR_INTERNAL_SERVER_MODEL // 500, na model
        }

        // Confirma a alteração da senha
        await transaction.commit()

        // Prepara a resposta
        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATED_ITEM.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATED_ITEM.status_code
        customMessages.DEFAULT_MESSAGE.message = 'Senha alterada com sucesso.'

        return customMessages.DEFAULT_MESSAGE // 200, senha alterada

    } catch (error) {
        // Desfaz as operações se a transação ainda estiver ativa
        if (transaction && !transaction.isCompleted())
            await transaction.rollback()

        return customMessages.ERROR_INTERNAL_SERVER_SERVICES // 500, na services
    }
}

module.exports = {
    buscarPerfilEstabelecimentoService,
    atualizarPerfilEstabelecimentoService,
    alterarSenhaEstabelecimentoService
}
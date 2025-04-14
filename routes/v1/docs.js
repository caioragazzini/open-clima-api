const swaggerJSDoc = require('swagger-jsdoc');

const swaggerBase = {
    failOnErrors: true,
    openapi: '3.0.0',
    info: {
        title: 'API de Clima - Tempo',
        description: 'API para obter informações meteorológicas e climáticas de diversas localidades.',
        version: '0.0.1',
    },
    components: {
        securitySchemes: {
            auth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            otp: {
                type: 'apiKey',
                in: 'header',
                name: 'totp',
            },
        },
        schemas: {
            Weather: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '675a00b15a7665f715197081' },
                userId: {
                  type: 'string',
                  format: 'objectId',
                  description: 'ID do usuário que consultou o clima (referência ao schema de User)',
                  example: '65f3a7b2e19a5b3c8d2f10e1',
                },
                cidade: {
                  type: 'string',
                  description: 'Cidade para a qual as informações climáticas foram consultadas',
                  example: 'Sorocaba',
                },
                temperatura: {
                  type: 'number',
                  description: 'Temperatura em graus Celsius',
                  example: 28.5,
                },
                condicaoClimatica: {
                  type: 'string',
                  description: 'Descrição da condição climática',
                  example: 'Parcialmente nublado',
                },
                dataConsulta: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Data e hora em que a consulta climática foi realizada',
                  example: '2025-04-14T14:55:00.000Z',
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Data e hora em que o documento foi criado',
                  example: '2025-04-14T14:55:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Data e hora em que o documento foi atualizado pela última vez',
                  example: '2025-04-14T14:55:00.000Z',
                },
                
                },
            },
        },
    },

paths: {
        '/v1/weather': {
            post: {
                description: 'Verifica clima tempo',
                security: [{ auth: [] }, { otp: [] }],
                tags: ['weather'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    valor: { type: 'number', example: 3000 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Saque realizado com sucesso' },
                    422: { description: 'Saldo insuficiente ou erro no saque' },
                },
            },
        },
        '/v1/weather/historico': {
            get: {
                description: 'Lista o histórico de clima por usuário',
                security: [{ auth: [] }, { otp: [] }],
                tags: ['weather'],
                parameters: [
                    { name: 'userId', in: 'query', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Histórico retornado com sucesso' },
                    400: { description: 'Parâmetro userId ausente' },
                },
            },
        },
        '/v1/weather/alertas-personalizados': {
            get: {
                description: 'Consulta alertas personalizados de clima',
                security: [{ auth: [] }, { otp: [] }],
                tags: ['weather'],
                parameters: [
                    { name: 'userId', in: 'query', required: true, schema: { type: 'string' } },
                    { name: 'cidade', in: 'query', required: false, schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Alertas personalizados retornados' },
                    400: { description: 'Parâmetro userId ausente' },
                },
            },
            post: {
                description: 'Cria um novo alerta personalizado de clima',
                security: [{ auth: [] }, { otp: [] }],
                tags: ['weather'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    cidade: { type: 'string' },
                                    userId: { type: 'string' },
                                    tipo: { type: 'string' },
                                    valor: { type: 'number' },
                                },
                                required: ['cidade', 'userId', 'tipo', 'valor']
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Alerta criado com sucesso' },
                    400: { description: 'Parâmetros obrigatórios ausentes' },
                },
            },
        },
        '/v1/users': {
            post: {
                description: 'Cria um novo usuário',
                tags: ['users'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    usuario: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string', example: 'caioragazzini@gmail.com.br' },
                                            cpf: { type: 'string', example: '146.897.780-60' },
                                            nome: { type: 'string', example: 'João' },
                                            senha: { type: 'string', example: '1234@ebac' },
                                        },
                                    },
                                    redirect: { type: 'string', example: 'https://minhaapp.com/confirmado' }
                                },
                                required: ['usuario', 'redirect']
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Usuário criado com sucesso' },
                    422: { description: 'Erro ao criar usuário' },
                },
            },
        },
        '/v1/users/me': {
            get: {
                description: 'Retorna o perfil do usuário(a)',
                security: [{ auth: [] }],
                tags: ['usuario'],
                responses: {
                    200: {
                        description: 'Informações do perfil do usuário',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        sucesso: { type: 'boolean', example: true },
                                        usuario: { type: 'object' },
                                        saldo: { type: 'number', example: 1000.50 }
                                    },
                                },
                            },
                        },
                    },
                    401: { description: 'Autorização ausente ou inválida' },
                },
            },
        },
        '/v1/users/senha': {
            put: {
                description: 'Atualiza a senha do usuário autenticado',
                security: [{ auth: [] }],
                tags: ['users'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    senha: { type: 'string', example: 'novaSenha@123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Senha atualizada com sucesso' },
                    422: { description: 'Erro ao atualizar a senha' },
                },
            },
        },
        '/v1/status': {
            get: {
                description: 'Retorna o status da API',
                tags: ['status'],
                responses: {
                    200: {
                        description: 'API está online',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'online' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },    
    }
}

const opcoes = {
    definition: swaggerBase,
    apis: ['./routes/v1/*.js'],
};

module.exports = swaggerJSDoc(opcoes);
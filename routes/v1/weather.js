const express = require('express');
const { listarHistoricoPorUsuario, consultarAlertasPersonalizados, criarAlertaPersonalizado } = require('../../services/weather');
const { buscaDadosClimaOnline } = require('../../services/busca-clima');
const { logger } = require('../../utils');  

const router = express.Router();

// Rota para consultar clima
router.get('/', async (req, res) => {
  const { cidade, userId } = req.query;

  if (!cidade || !userId) {
    return res.status(400).json({
      sucesso: false,
      erro: 'Cidade e userId são obrigatórios',
    });
  }

  try {
    const clima = await buscaDadosClimaOnline(cidade, userId);
    console.log("🚀 ~ router.get ~ clima---2#$%:", clima)
    res.json({
      sucesso: true,
      clima,
    });
  } catch (e) {
    logger.error(`Erro ao consultar clima: ${e.message}`);
    res.status(500).json({
      sucesso: false,
      erro: e.message,
    });
  }
});

// Rota para listar histórico de clima por usuário
router.get('/historico', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      sucesso: false,
      erro: 'userId é obrigatório',
    });
  }

  try {
    const historico = await listarHistoricoPorUsuario(userId);
    res.json({
      sucesso: true,
      historico,
    });
  } catch (e) {
    logger.error(`Erro ao listar histórico: ${e.message}`);
    res.status(500).json({
      sucesso: false,
      erro: e.message,
    });
  }
});


// Rota para consultar alertas personalizados
router.get('/alertas-personalizados', async (req, res) => {
  const { cidade, userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      sucesso: false,
      erro: 'userId é obrigatório',
    });
  }

  try {
    const alertas = await consultarAlertasPersonalizados(userId, cidade); // Passa 'cidade' (pode ser undefined)
    res.json(alertas);
  } catch (e) {
    logger.error(`Erro ao consultar alertas personalizados: ${e.message}`);
    res.status(500).json({
      sucesso: false,
      erro: e.message,
    });
  }
});

// Rota para criar um alerta personalizado
router.post('/alertas-personalizados', async (req, res) => {
  const { cidade, userId, tipo, valor } = req.body;

  if (!cidade || !userId || !tipo || !valor) {
    return res.status(400).json({
      sucesso: false,
      erro: 'Cidade, userId, tipo e valor são obrigatórios',
    });
  }

  try {
    const resultado = await criarAlertaPersonalizado(userId, cidade, tipo, valor);
    res.json(resultado);
  } catch (e) {
    logger.error(`Erro ao criar alerta personalizado: ${e.message}`);
    res.status(500).json({
      sucesso: false,
      erro: e.message,
    });
  }
});


module.exports = router;


/**
 * @openapi
 * /v1/weather:
 *   get:
 *     description: Retorna as informações do clima para a cidade especificada
 *     tags:
 *       - weather
 *     parameters:
 *       - name: cidade
 *         in: query
 *         required: true
 *         description: Nome da cidade para consultar o clima
 *         schema:
 *           type: string
 *           example: "São Paulo"
 *       - name: userId
 *         in: query
 *         required: true
 *         description: ID do usuário que está fazendo a consulta
 *         schema:
 *           type: string
 *           example: "123456789"
 *     responses:
 *       200:
 *         description: Clima retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 clima:
 *                   type: object
 *                   properties:
 *                     temperatura:
 *                       type: number
 *                       example: 25.5
 *                     umidade:
 *                       type: number
 *                       example: 60
 *                     condicao:
 *                       type: string
 *                       example: "Ensolarado"
 *       400:
 *         description: Requisição inválida (parâmetros obrigatórios ausentes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "Cidade e userId são obrigatórios"
 *       500:
 *         description: Erro interno ao consultar o clima
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "Erro ao consultar clima: Erro de conexão"
 */

/**
 * @openapi
 * /v1/weather/historico:
 *   get:
 *     description: Retorna o histórico de buscas de clima feitas por um usuário
 *     tags:
 *       - weather
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         description: ID do usuário para listar o histórico
 *         schema:
 *           type: string
 *           example: "123456789"
 *     responses:
 *       200:
 *         description: Histórico retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 historico:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       cidade:
 *                         type: string
 *                         example: "São Paulo"
 *                       dataConsulta:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-13T14:30:00Z"
 *                       temperatura:
 *                         type: number
 *                         example: 24.8
 *                       condicao:
 *                         type: string
 *                         example: "Parcialmente nublado"
 *       400:
 *         description: Requisição inválida (userId ausente)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "userId é obrigatório"
 *       500:
 *         description: Erro interno ao buscar histórico
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "Erro ao listar histórico: Erro desconhecido"
 */

/**
 * @openapi
 * /v1/weather/alertas-personalizados:
 *   get:
 *     description: Consulta alertas personalizados de clima por usuário e, opcionalmente, por cidade.
 *     tags:
 *       - weather
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         description: ID do usuário para buscar os alertas
 *         schema:
 *           type: string
 *           example: "123456789"
 *       - name: cidade
 *         in: query
 *         required: false
 *         description: Cidade para filtrar os alertas personalizados
 *         schema:
 *           type: string
 *           example: "Rio de Janeiro"
 *     responses:
 *       200:
 *         description: Alertas personalizados retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 alertas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tipo:
 *                         type: string
 *                         example: "chuva"
 *                       mensagem:
 *                         type: string
 *                         example: "Alta probabilidade de chuva nas próximas 24h"
 *                       cidade:
 *                         type: string
 *                         example: "Rio de Janeiro"
 *                       data:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-13T10:00:00Z"
 *       400:
 *         description: Requisição inválida (userId ausente)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "userId é obrigatório"
 *       500:
 *         description: Erro interno ao consultar os alertas personalizados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "Erro ao consultar alertas personalizados: Erro inesperado"
 */

/**
 * @openapi
 * /v1/weather/alertas-personalizados:
 *   post:
 *     description: Cria um novo alerta personalizado para um usuário e cidade específica.
 *     tags:
 *       - weather
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cidade
 *               - userId
 *               - tipo
 *               - valor
 *             properties:
 *               cidade:
 *                 type: string
 *                 example: "São Paulo"
 *               userId:
 *                 type: string
 *                 example: "987654321"
 *               tipo:
 *                 type: string
 *                 example: "chuva"
 *               valor:
 *                 type: number
 *                 description: Valor de referência para o alerta
 *                 example: 80
 *     responses:
 *       200:
 *         description: Alerta personalizado criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 alerta:
 *                   type: object
 *                   properties:
 *                     cidade:
 *                       type: string
 *                       example: "São Paulo"
 *                     userId:
 *                       type: string
 *                       example: "987654321"
 *                     tipo:
 *                       type: string
 *                       example: "chuva"
 *                     valor:
 *                       type: number
 *                       example: 80
 *                     criadoEm:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-14T12:00:00Z"
 *       400:
 *         description: Requisição inválida (campos obrigatórios ausentes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "Cidade, userId, tipo e valor são obrigatórios"
 *       500:
 *         description: Erro interno ao criar o alerta personalizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: false
 *                 erro:
 *                   type: string
 *                   example: "Erro ao criar alerta personalizado: Erro inesperado"
 */

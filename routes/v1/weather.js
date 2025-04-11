const express = require('express');
const { consultarClima, listarHistoricoPorUsuario, consultarAlertasPersonalizados, criarAlertaPersonalizado } = require('../../services/weather');
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

const express = require('express');
const { consultarClima, listarHistoricoPorUsuario } = require('../../services/weather');
const { logger } = require('../../utils');  

const router = express.Router();

// Rota para consultar clima
router.get('/clima', async (req, res) => {
  const { cidade, userId } = req.query;

  if (!cidade || !userId) {
    return res.status(400).json({
      sucesso: false,
      erro: 'Cidade e userId são obrigatórios',
    });
  }

  try {
    const clima = await consultarClima(cidade, userId);
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

module.exports = router;

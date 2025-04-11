const { buscaDadosClimaOnline } = require('../services/busca-clima');
const { Weather, CustomAlert } = require('../models');
const { logger } = require('../utils');

var climaWorker = async (job, done) => {
  try {
    logger.info(`Buscando Dados de Clima (Dinâmico)... Tentativa ${job.attemptsMade + 1} / ${job.opts.attempts}`);

    // 1. Buscar todas as cidades únicas que possuem alertas cadastrados.
    const cidadesComAlertas = await CustomAlert.distinct('cidade');
    logger.info(`Cidades com alertas encontrados: ${cidadesComAlertas.join(', ')}`);

    const dadosClima = await Promise.all(
      cidadesComAlertas.map(cidade => buscaDadosClimaOnline(cidade, 'system-worker')) // Passando um userId genérico
    );

    logger.info('Dados de clima requisitados com sucesso...');

    const registrosClima = dadosClima.filter(data => data !== null).map(data => ({
      cidade: data.cidade,
      temperatura: data.temperatura,
      condicaoClimatica: data.condicao,
      dataConsulta: data.data,
      userId: 'system-worker', // Identifica a origem dos dados
    }));

    if (registrosClima.length > 0) {
      await Weather.insertMany(registrosClima);
      logger.info('Dados de clima inseridos no banco!');
    } else {
      logger.info('Nenhum dado de clima válido retornado.');
    }

    done();

  } catch (err) {
    logger.error(`Erro ao processar o job de clima (dinâmico): ${err.message}`);
    done(err);
  }
};

module.exports = climaWorker;
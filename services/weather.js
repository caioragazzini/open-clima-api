const axios = require('axios');
const { Weather } = require('../models');

const API_URL = process.env.OPENWEATHER_API_URL;
const API_KEY = process.env.OPENWEATHER_KEY;

const consultarClima = async (cidade, userId) => {
  try {
    const { data } = await axios.get(API_URL, {
      params: {
        q: cidade,
        appid: API_KEY,
        units: 'metric',
        lang: 'pt_br'
      }
    });
    console.log("🚀 ~ consultarClima ~ data:", data)

    const temperatura = data.main.temp;
    const condicaoClimatica = data.weather[0].description;

    const registro = await Weather.create({
      userId,
      cidade,
      temperatura,
      condicaoClimatica,
      dataConsulta: new Date()
    });

    return registro;

  } catch (error) {
    console.error(`Erro ao consultar clima para ${cidade}:`, error.message);
    throw new Error('Erro ao consultar dados de clima.');
  }
};

const listarHistoricoPorUsuario = async (userId) => {
  try {
    const historico = await Weather
      .find({ userId })
      .sort({ dataConsulta: -1 });

    return historico;

  } catch (error) {
    console.error(`Erro ao buscar histórico para o usuário ${userId}:`, error.message);
    throw new Error('Erro ao buscar histórico de clima.');
  }
};

module.exports = {
  consultarClima,
  listarHistoricoPorUsuario
};

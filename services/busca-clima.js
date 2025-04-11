const axios = require('axios');
const { Weather } = require('../models'); 
const { logger } = require('../utils');

const buscaDadosClimaOnline = async (cidade, userId) => { 
  const url = `${process.env.OPENWEATHER_API_URL}`;

  try {
    const { data } = await axios.get(url, {
      params: {
        q: cidade,
        appid: process.env.OPENWEATHER_KEY,
        lang: 'pt_br',
        units: 'metric', 
      },
    });

    const dataDaConsulta = new Date();

    
    return {
      cidade: data.name,
      temperatura: data.main.temp,
      umidade: data.main.humidity,
      condicao: data.weather[0].description,
      data: dataDaConsulta,
    };
  } catch (error) {
    logger.error(`Erro ao buscar dados de clima online para ${cidade}: ${error.message}`);
    return null; 
  }
};

const buscaDadosClimaNoBanco = async () => {
  return await Weather.aggregate([
    { "$sort": { "dataConsulta": -1 } }, 
    {
      "$group": {
        "_id": "$cidade",
        "dataConsulta": { "$first": "$dataConsulta" },
        "cidade": { "$first": "$cidade" },
        "temperatura": { "$first": "$temperatura" },
        "condicaoClimatica": { "$first": "$condicaoClimatica" }, 
        "userId": { "$first": "$userId" },
        "id": { "$first": "$_id" },
      }
    },
    {
      "$unset": "_id"
    }
  ]);
};

module.exports = {
  buscaDadosClimaOnline,
  buscaDadosClimaNoBanco,
};
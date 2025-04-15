const axios = require('axios');
const { Weather } = require('../models'); 
const { logger } = require('../utils');

const API_URL = process.env.OPENWEATHER_API_URL;
const API_KEY = process.env.OPENWEATHER_KEY;

const buscaDadosClimaOnline = async (cidade, userId) => { 
  //const url = `${process.env.OPENWEATHER_API_URL}`;

  try {
    const { data } = await axios.get(API_URL, {
      params: {
        q: cidade,
        appid: API_KEY,
        units: 'metric',
        lang: 'pt_br'
      },
    });

    const temperatura = data.main.temp;
    const condicaoClimatica = data.weather[0].description;

    const registro = await Weather.create({
      userId,
      cidade,
      temperatura,
      condicaoClimatica,
      dataConsulta: new Date()
    });
    console.log("🚀 ~ buscaDadosClimaOnline ~ registro:", registro)

    return registro;

  } catch (error) {
    console.error(`Erro ao consultar clima para ${cidade}:`, error.message);
    throw new Error('Erro ao consultar dados de clima.');
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
const axios = require('axios');
const { Weather ,CustomAlert} = require('../models');

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

// Função para consultar alertas personalizados do usuário
const consultarAlertasPersonalizados = async (cidade, userId) => {
  try {
    // Consultar as condições climáticas para a cidade fornecida
    const { data } = await axios.get(API_URL, {
      params: {
        q: cidade,
        appid: API_KEY,
        lang: 'pt_br',
      },
    });

    // Buscar os alertas personalizados do usuário
    const alertas = await CustomAlert.find({ userId, cidade });

    console.log("🚀 ~ consultarAlertasPersonalizados ~ alertas:", alertas)
    const alertasNotificados = [];

    // Verificar se algum alerta personalizado foi atendido
    for (let alerta of alertas) {
      const { tipo, valor } = alerta;

      if (tipo === 'temperatura' && data.main.temp >= valor) {
        alertasNotificados.push({
          tipo: 'temperatura',
          mensagem: `A temperatura atingiu ${data.main.temp}°C, ultrapassando seu limite de ${valor}°C!`,
        });
      } else if (tipo === 'umidade' && data.main.humidity >= valor) {
        alertasNotificados.push({
          tipo: 'umidade',
          mensagem: `A umidade atingiu ${data.main.humidity}%, ultrapassando seu limite de ${valor}%!`,
        });
      } else if (tipo === 'condicao' && data.weather.some(cond => cond.main.toLowerCase() === valor.toLowerCase())) {
        alertasNotificados.push({
          tipo: 'condicao',
          mensagem: `A condição climática é ${valor}, como você solicitou!`,
        });
      }
    }

    // Se algum alerta for notificado, retornamos os alertas
    if (alertasNotificados.length > 0) {
      return {
        sucesso: true,
        alertas: alertasNotificados,
      };
    }

    return {
      sucesso: true,
      mensagem: 'Não houve nenhum alerta ativado no momento.',
    };
  } catch (error) {
    console.error(`Erro ao consultar alertas personalizados para ${cidade}:`, error.message);
    throw new Error('Erro ao consultar alertas personalizados.');
  }
};

// Função para criar um alerta personalizado no banco de dados
const criarAlertaPersonalizado = async (userId, cidade, tipo, valor) => {
  try {
    const alerta = new CustomAlert({
      userId,
      cidade,
      tipo,
      valor,
    });

    await alerta.save();
    return { sucesso: true, mensagem: 'Alerta personalizado criado com sucesso!' };
  } catch (error) {
    console.error(`Erro ao criar alerta personalizado:`, error.message);
    throw new Error('Erro ao criar alerta personalizado.');
  }
};

module.exports = {
  consultarClima,
  listarHistoricoPorUsuario, 
  consultarAlertasPersonalizados,
  criarAlertaPersonalizado,
  
};

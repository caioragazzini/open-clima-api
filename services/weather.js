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

// Função genérica para consultar alertas personalizados do usuário (opcionalmente por cidade)
const consultarAlertasPersonalizados = async (userId, cidade) => {
  try {
    let alertas;

    // Se a cidade for fornecida, busca alertas para o usuário naquela cidade
    if (cidade) {
      const { data } = await axios.get(API_URL, {
        params: {
          q: cidade,
          appid: API_KEY,
          lang: 'pt_br',
        },
      });

      alertas = await CustomAlert.find({ userId: userId, cidade: cidade }).lean();
      console.log(`🚀 ~ consultarAlertasPersonalizados ~ Alertas para ${cidade}:`, alertas);

      const alertasNotificados = alertas.filter(alerta => {
        const { tipo, valor } = alerta;
        if (tipo === 'temperatura' && data.main.temp >= valor) return true;
        if (tipo === 'umidade' && data.main.humidity >= valor) return true;
        if (tipo === 'condicao' && data.weather.some(cond => cond.main.toLowerCase() === valor.toLowerCase())) return true;
        return false;
      }).map(alerta => {
        const { _id, tipo, valor } = alerta;
        if (alerta.tipo === 'temperatura') return { _id, tipo, mensagem: `A temperatura em ${cidade} atingiu ${data.main.temp}°C, ultrapassando seu limite de ${valor}°C!` };
        if (alerta.tipo === 'umidade') return { _id, tipo, mensagem: `A umidade em ${cidade} atingiu ${data.main.humidity}%, ultrapassando seu limite de ${valor}%!` };
        if (alerta.tipo === 'condicao') return { _id, tipo, mensagem: `A condição climática em ${cidade} é ${valor}, como você solicitou!` };
      });

      if (alertasNotificados.length > 0) {
        return { sucesso: true, alertas: alertasNotificados };
      } else {
        return { sucesso: true, mensagem: `Nenhum alerta ativado para ${cidade} no momento.` };
      }
    } else {
      // Se a cidade não for fornecida, busca todos os alertas para o usuário (sem verificação climática)
      alertas = await CustomAlert.find({ userId: userId }).lean();
      console.log("🚀 ~ consultarAlertasPersonalizados ~ Todos os alertas:", alertas);

      return {
        sucesso: true,
        alertas: alertas.map(alerta => ({
          _id: alerta._id,
          tipo: alerta.tipo,
          valor: alerta.valor,
          cidade: alerta.cidade,
          createdAt: alerta.createdAt, 
          mensagem: `Alerta de ${alerta.tipo} configurado com valor: ${alerta.valor}.`,
        })),
      };
    }
  } catch (error) {
    console.error(`Erro ao consultar alertas personalizados (cidade: ${cidade}, userId: ${userId}):`, error.message);
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

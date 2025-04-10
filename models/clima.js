const { Schema } = require('mongoose');

const ClimaSchema = new Schema({
  cidade: {
    type: String,
    required: true,
    trim: true,
  },
  temperatura: {
    type: Number,
    required: true,
  },
  sensacaoTermica: {
    type: Number,
  },
  umidade: {
    type: Number,
  },
  pressao: {
    type: Number,
  },
  velocidadeVento: {
    type: Number,
  },
  direcaoVento: {
    type: Number,
  },
  condicaoClimatica: {
    type: String,
    required: true,
    trim: true,
  },
  descricaoClimatica: {
    type: String,
    trim: true,
  },
  iconeClima: {
    type: String,
    trim: true,
  },
  dataHoraConsulta: {
    type: Date,
    default: Date.now,
  },
});

module.exports = ClimaSchema;
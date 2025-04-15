const { Schema } = require('mongoose');

const customAlertSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  cidade: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
    enum: ['tempestade', 'neve', 'vento','temperatura', 'umidade', 'condicao', 'chuva'], // Tipos de alertas possíveis
  },
  valor: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true 
});

module.exports = customAlertSchema;
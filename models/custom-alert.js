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
    enum: ['temperatura', 'umidade', 'condicao'], // Tipos de alertas possíveis
  },
  valor: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true // Adiciona automaticamente createdAt e updatedAt
});

module.exports = customAlertSchema;
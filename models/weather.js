const { Schema } = require('mongoose');

const WeatherSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  cidade: {
    type: String,
    required: true,
    trim: true
  },
  temperatura: {
    type: Number,
    required: true
  },
  condicaoClimatica: {
    type: String,
    required: true
  },
  dataConsulta: {
    type: Date,
    default: Date.now
  }
},
{
  timestamps: true
}
);


module.exports = WeatherSchema;
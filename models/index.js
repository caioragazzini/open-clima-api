const mongoose = require('mongoose');
const UsuarioSchema = require('./usuario');
const ClimaSchema = require('./clima');


const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Clima = mongoose.model('Clima', ClimaSchema);

const connect = async () => {
    await mongoose.connect(process.env.MONGO_URL);
  }

  module.exports = {
    connect,
    Usuario,
    Clima,    
  }
  
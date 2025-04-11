const { Schema } = require('mongoose');
const { cpf } = require('cpf-cnpj-validator');

const UserSchema = new Schema({
    nome:
    {
        type: String, 
        required: true, 
        min: 4
    },
    cpf:
    {
        type: String, 
        required: true, 
        unique: true, 
        validate: 
        {
            validator: function(v) 
            {
             return cpf.isValid(v);
            }, 
            message: props=> `${props.value} não é um cpf válido`
        },
    },
    email:
    {
        type: String, 
        required: true, 
        min: 4, 
        unique: true, 
        validate:
        {
            validator : function(v) 
                {
                    return v.match('@');
                },
            message: props => `${props.value} não é um email válido`,
        },
    },  
    senha:
        {
            type: String, 
            required: true, 
            select: false,
        },

    confirmado:{
        type: Boolean,
        default: false,
    },
    tokenDeConfirmacao:{
        type: String,
        unique:true,
        sparse: true,
        select: false,
    },

    tokenDeRecuperacao:{
        type: String,
        unique:true,
        sparse: true,
        select: false,
    },
    
    segredoOtp: {
        type: String,
        unique: true,
        sparse: true,
        select: false,
    },

  cidadeFavorita: {
    type: String,
    trim: true,
  },

  historicoClima: [{
    cidade: {
      type: String,
      required: true,
      trim: true,
    },

    dataHoraConsulta: {
      type: Date,
      default: Date.now,
    },

    temperatura: Number,
    condicaoClimatica: String,
    
  }],
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now,
  },
});


module.exports = UserSchema;
const jsonWebToken = require('jsonwebtoken');
const { User } = require('../models');

const validaTokenSenha = async(token)=>{
    try{
        const jwt =jsonWebToken.verify(token, process.env.JWT_SECRET_KEY);
        const usuario = await User.findOne({ tokenDeRecuperacao: jwt.token});

        if(!usuario){
            throw new Error('token não encontrado');
        }

        return jsonWebToken.sign({ id: usuario._id}, env.JWT_SECRET_KEY);

    } catch(e){
        throw new Error('Token não encontrado ou expirado. Requisite novamente!');


    }
    
};

module.exports = validaTokenSenha;

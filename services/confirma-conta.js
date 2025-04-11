const { User} = require('../models');

const confirmaconta = async (token)=>{
    const usuario = await User.findOne({ tokenDeConfirmacao: token});

    if(!usuario){
        throw new Error('Usuário não encontrado');
    }
    else{
        usuario.confirmado = true;
        await usuario.save();
    }
}

module.exports = confirmaconta;
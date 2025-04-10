
module.exports = {
    
    criarUsuario: require('./cria-usuario'),
    logaUsuario: require('./loga-usuario'),
    
    enviaEmailDeConfirmacao: require('./envia-email').enviaEmailDeConfirmacao,
    enviaEmailDeRecuperacao: require('./envia-email').enviaEmailDeRecuperacao,
    enviaEmailDeParabens: require('./envia-email').enviaEmailDeParabens,
    confirmaConta: require('./confirma-conta'),
    validaTokenAlteracaoDeSenha: require('./valida-token-senha'),
   
    geraSegredo: require('./otp').geraSegredo,
    validaOtp: require('./otp').validaOtp,
   
};
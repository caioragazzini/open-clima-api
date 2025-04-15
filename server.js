require('dotenv').config();

const app = require('./app');

const { logger } = require('./utils');
const { connect } = require('./models');
const { agendaTarefasClima } = require('./workers');

// inicializa tarefas
//agendaTarefasClima();
//agendaRanking();
//agendaLucroUsuarios();

const porta = 3000;
app.listen(porta, () => {
  connect();

  logger.info(`Servidor ouvindo na porta ${porta}`);
});

const Queue = require('bull');
const climaWorker = require('./busca-clima'); 

const climaQueue = new Queue('busca-clima', process.env.REDIS_URL);

climaQueue.process(climaWorker);

const agendaTarefasClima = async () => {
  const climaAgendados = await climaQueue.getRepeatableJobs();

  for (const jobDeClima of climaAgendados) {
    await climaQueue.removeRepeatableByKey(jobDeClima.key);
  }

  
  climaQueue.add(
    {},
    {
      repeat: {
        cron: '*/1 * * * *', 
      },
      attempts: 3,
      backoff: 5000,
      jobId: 'job-a-cada-1-minutos-clima', 
    }
  );

  console.log('Job de clima agendado para executar a cada 1 minutos.');
};

module.exports = {
  agendaTarefasClima,
};
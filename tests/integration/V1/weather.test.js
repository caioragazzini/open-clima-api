const request = require('supertest');
const faker = require('faker-br');

const app = require('../../../app');
const { geraJwt } = require('./shared/autenticacao');
const { User } = require('../../../models');

describe('/v1/weather', () => {
  let usuario, jwt;

  beforeEach(async () => {
    await User.deleteMany();

    usuario = await User.create({
      nome: faker.name.findName(),
      email: faker.internet.email(),
      senha: 'senhasegura',
      cpf: faker.br.cpf(),
      confirmado: true,
    });

    jwt = geraJwt(usuario._id);
  });

  describe('GET /v1/weather', () => {
    test('deve retornar clima com sucesso', async () => {
      const cidade = 'São Paulo';

      const res = await request(app)
        .get(`/v1/weather?cidade=${cidade}&userId=${usuario._id}`)
        .set('Authorization', `Bearer ${jwt}`);

      expect(res.status).toBe(200);
      expect(res.body.sucesso).toBe(true);
      expect(res.body.clima).toBeDefined();
    });

    test('deve retornar erro 400 se cidade ou userId estiverem ausentes', async () => {
      const res = await request(app)
        .get('/v1/weather')
        .set('Authorization', `Bearer ${jwt}`);

      expect(res.status).toBe(400);
      expect(res.body.sucesso).toBe(false);
      expect(res.body.erro).toBe('Cidade e userId são obrigatórios');
    });
  });

  describe('GET /v1/weather/historico', () => {
    test('deve retornar histórico com sucesso', async () => {
      const res = await request(app)
        .get(`/v1/weather/historico?userId=${usuario._id}`)
        .set('Authorization', `Bearer ${jwt}`);

      expect(res.status).toBe(200);
      expect(res.body.sucesso).toBe(true);
      expect(Array.isArray(res.body.historico)).toBe(true);
    });

    test('deve retornar erro 400 se userId estiver ausente', async () => {
      const res = await request(app)
        .get('/v1/weather/historico')
        .set('Authorization', `Bearer ${jwt}`);

      expect(res.status).toBe(400);
      expect(res.body.erro).toBe('userId é obrigatório');
    });
  });

  describe('GET /v1/weather/alertas-personalizados', () => {
    test('deve retornar alertas personalizados com sucesso', async () => {
      const res = await request(app)
        .get(`/v1/weather/alertas-personalizados?cidade=Rio de Janeiro&userId=${usuario._id}`)
        .set('Authorization', `Bearer ${jwt}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined(); // Depende do formato do retorno real
    });

    test('deve retornar erro 400 se userId estiver ausente', async () => {
      const res = await request(app)
        .get('/v1/weather/alertas-personalizados?cidade=Rio de Janeiro')
        .set('Authorization', `Bearer ${jwt}`);

      expect(res.status).toBe(400);
      expect(res.body.erro).toBe('userId é obrigatório');
    });
  });

  describe('POST /v1/weather/alertas-personalizados', () => {
    test('deve criar alerta com sucesso', async () => {
      const payload = {
        cidade: 'Campinas',
        userId: usuario._id.toString(),
        tipo: 'chuva',
        valor: 80,
      };

      const res = await request(app)
        .post('/v1/weather/alertas-personalizados')
        .set('Authorization', `Bearer ${jwt}`)
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });

    test('deve retornar erro 400 se algum campo estiver ausente', async () => {
      const res = await request(app)
        .post('/v1/weather/alertas-personalizados')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          cidade: 'Campinas',
          userId: usuario._id.toString(),
          tipo: 'chuva',
          // valor ausente
        });

      expect(res.status).toBe(400);
      expect(res.body.erro).toBe('Cidade, userId, tipo e valor são obrigatórios');
    });
  });
});

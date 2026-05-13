process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const request = require('supertest');
const app = require('../src/app');
const { connect, close, clear } = require('./setup');

beforeAll(connect);
afterAll(close);
beforeEach(clear);

describe('Gestion des erreurs globales', () => {
  test('route inexistante retourne 404', async () => {
    const res = await request(app).get('/api/cette-route-nexiste-pas');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('méthode non autorisée retourne 404', async () => {
    const res = await request(app).delete('/api/auth/login');
    expect(res.status).toBe(404);
  });

  test('validation échoue si champs manquants à l\'inscription', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'incomplet@pulse.app',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('validation échoue si email malformé', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'pasunemail',
      password: 'password1',
      handle: 'test',
      displayName: 'Test',
    });
    expect(res.status).toBe(400);
  });

  test('accès à une ressource privée sans token retourne 401', async () => {
    const res = await request(app).get('/api/activities');
    expect(res.status).toBe(401);
  });

  test('accès au panier sans token retourne 401', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(401);
  });

  test('accès aux commandes sans token retourne 401', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
  });
});

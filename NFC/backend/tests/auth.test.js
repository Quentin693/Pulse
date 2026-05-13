process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const request = require('supertest');
const app = require('../src/app');
const { connect, close, clear } = require('./setup');

beforeAll(connect);
afterAll(close);
beforeEach(clear);

describe('Auth flow', () => {
  test('register creates a user and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'alice@pulse.app',
      password: 'password1',
      handle: 'alice',
      displayName: 'Alice',
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('alice@pulse.app');
    expect(res.body.user.handle).toBe('alice');
  });

  test('register rejects duplicate email', async () => {
    const payload = {
      email: 'a@a.app',
      password: 'password1',
      handle: 'aaa',
      displayName: 'Aaron',
    };
    await request(app).post('/api/auth/register').send(payload);
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...payload, handle: 'bbb' });
    expect(res.status).toBe(409);
  });

  test('register fails validation when password too short', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'b@b.app',
      password: '123',
      handle: 'bob',
      displayName: 'Bob',
    });
    expect(res.status).toBe(400);
    expect(res.body.error.details).toBeDefined();
  });

  test('login returns token and /me works', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'c@c.app',
      password: 'password1',
      handle: 'carl',
      displayName: 'Carl',
    });
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'c@c.app', password: 'password1' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();

    const me = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body.user.handle).toBe('carl');
  });

  test('protected route rejects without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('login fails with wrong password', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'd@d.app',
      password: 'password1',
      handle: 'dave',
      displayName: 'Dave',
    });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'd@d.app', password: 'mauvaismdp' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  test('login fails with non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'fantome@pulse.app', password: 'password1' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  test('protected route with invalid token returns 401', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer tokeninvalide');
    expect(res.status).toBe(401);
  });
});

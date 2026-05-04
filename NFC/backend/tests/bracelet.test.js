process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const request = require('supertest');
const app = require('../src/app');
const { connect, close, clear } = require('./setup');

beforeAll(connect);
afterAll(close);
beforeEach(clear);

async function setupUser(handle = 'nfcuser') {
  const r = await request(app).post('/api/auth/register').send({
    email: `${handle}@pulse.app`,
    password: 'password1',
    handle,
    displayName: handle,
  });
  return r.body.token;
}

describe('NFC bracelets', () => {
  test('owner can register and tap simulates redirect', async () => {
    const token = await setupUser('runner');
    const create = await request(app)
      .post('/api/bracelets')
      .set('Authorization', `Bearer ${token}`)
      .send({ tagId: 'ABC123', nickname: 'Runner band' });
    expect(create.status).toBe(201);
    expect(create.body.bracelet.tagId).toBe('ABC123');

    const tap = await request(app).post('/api/public/nfc/abc123/tap');
    expect(tap.status).toBe(200);
    expect(tap.body.handle).toBe('runner');
    expect(tap.body.redirect).toBe('/u/runner');
    expect(tap.body.bracelet.tapCount).toBe(1);
  });

  test('cannot register the same tag twice', async () => {
    const token = await setupUser('one');
    await request(app)
      .post('/api/bracelets')
      .set('Authorization', `Bearer ${token}`)
      .send({ tagId: 'DUPLICATE' });
    const tokenTwo = await setupUser('two');
    const res = await request(app)
      .post('/api/bracelets')
      .set('Authorization', `Bearer ${tokenTwo}`)
      .send({ tagId: 'duplicate' });
    expect(res.status).toBe(409);
  });
});

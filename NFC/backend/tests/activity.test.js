process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const request = require('supertest');
const app = require('../src/app');
const { connect, close, clear } = require('./setup');

beforeAll(connect);
afterAll(close);
beforeEach(clear);

async function createUser(suffix = '') {
  const res = await request(app).post('/api/auth/register').send({
    email: `tester${suffix}@pulse.app`,
    password: 'password1',
    handle: `tester${suffix}`,
    displayName: 'Tester',
  });
  return res.body;
}

describe('Activities', () => {
  test('user can create and list activities', async () => {
    const { token } = await createUser();

    const create = await request(app)
      .post('/api/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'running',
        title: 'Morning run',
        durationMin: 35,
        distanceKm: 6.2,
        calories: 420,
      });
    expect(create.status).toBe(201);
    expect(create.body.activity.title).toBe('Morning run');

    const list = await request(app)
      .get('/api/activities')
      .set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.items.length).toBe(1);
  });

  test('public profile aggregates totals', async () => {
    const { token } = await createUser('-pub');
    await request(app)
      .post('/api/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'running', title: 'Run A', durationMin: 30, distanceKm: 5, calories: 300 });
    await request(app)
      .post('/api/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'cycling', title: 'Ride B', durationMin: 60, distanceKm: 20, calories: 600 });

    const res = await request(app).get('/api/public/profile/tester-pub');
    expect(res.status).toBe(200);
    expect(res.body.totals.distanceKm).toBeCloseTo(25);
    expect(res.body.activities.length).toBe(2);
  });
});

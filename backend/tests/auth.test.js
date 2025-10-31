const request = require('supertest');
const app = require('../src/app');
const authService = require('../src/services/auth.service');
const env = require('../src/config/env');

describe('Auth API', () => {
  beforeAll(() => {
    env.jwt.secret = 'test';
    env.jwt.refreshSecret = 'test-refresh';
  });

  test('registers and logs in user', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@example.com', password: 'Password1!', name: 'Tester' })
      .expect(201);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'Password1!' })
      .expect(200);

    expect(response.body.tokens.access).toBeDefined();
    expect(response.body.tokens.refresh).toBeDefined();
  });

  test('rejects invalid login', async () => {
    await authService.register({ email: 'user@example.com', password: 'Password1!', name: 'User' });
    await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'wrong' })
      .expect(401);
  });
});

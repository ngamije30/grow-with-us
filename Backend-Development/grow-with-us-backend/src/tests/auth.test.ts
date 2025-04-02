import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';
import setup from './setup';

const prisma = new PrismaClient();

describe('Authentication', () => {
  let cleanup: () => Promise<void>;

  beforeAll(async () => {
    cleanup = await setup();
  });

  afterAll(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('should login an existing user', async () => {
    // First register a user
    await request(app)
      .post('/api/users/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

    // Then try to login
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
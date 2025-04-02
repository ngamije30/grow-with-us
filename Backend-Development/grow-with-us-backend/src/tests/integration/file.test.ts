import request from 'supertest';
import { app } from '../../app';
import { PrismaClient } from '@prisma/client';
import { createTestUser, generateAuthToken } from '../helpers';

const prisma = new PrismaClient();

describe('File Management', () => {
  let user: any;
  let authToken: string;

  beforeAll(async () => {
    user = await createTestUser();
    authToken = generateAuthToken(user.id);
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  describe('File Upload', () => {
    it('should upload a file successfully', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('test file content'), 'test.txt');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('test.txt');
    });

    it('should reject invalid file types', async () => {
      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('test content'), 'test.exe');

      expect(response.status).toBe(400);
    });
  });
});
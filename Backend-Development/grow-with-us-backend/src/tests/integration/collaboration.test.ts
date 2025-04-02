import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';
import { app } from '../../app';
import { PrismaClient } from '@prisma/client';
import { createTestUser, generateAuthToken } from '../helpers';

const prisma = new PrismaClient();

describe('Collaboration Feature', () => {
  let httpServer: any;
  let io: Server;
  let clientSocket1: any;
  let clientSocket2: any;
  let user1: any;
  let user2: any;

  beforeAll(async () => {
    httpServer = createServer(app);
    io = new Server(httpServer);
    httpServer.listen();

    // Create test users
    user1 = await createTestUser();
    user2 = await createTestUser();

    // Connect sockets
    const port = (httpServer.address() as any).port;
    const url = `http://localhost:${port}`;
    
    clientSocket1 = Client(url, {
      auth: { token: generateAuthToken(user1.id) },
    });
    
    clientSocket2 = Client(url, {
      auth: { token: generateAuthToken(user2.id) },
    });
  });

  afterAll(async () => {
    await Promise.all([
      new Promise(resolve => clientSocket1.close(resolve)),
      new Promise(resolve => clientSocket2.close(resolve)),
      new Promise(resolve => httpServer.close(resolve)),
      prisma.user.deleteMany(),
    ]);
  });

  it('should handle document collaboration', (done) => {
    const documentId = 'test-doc-1';
    const testContent = 'Hello, World!';

    clientSocket1.emit('join_document', { documentId, user: user1 });
    clientSocket2.emit('join_document', { documentId, user: user2 });

    clientSocket2.on('user_joined', (users: any[]) => {
      expect(users.length).toBe(2);
      
      clientSocket1.emit('content_change', {
        documentId,
        content: testContent,
      });
    });

    clientSocket2.on('content_change', (content: string) => {
      expect(content).toBe(testContent);
      done();
    });
  });
});
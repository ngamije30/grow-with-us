import autocannon from 'autocannon';
import { app } from '../../app';
import { createTestUser, generateAuthToken } from '../helpers';

describe('Performance Tests', () => {
  let server: any;
  let token: string;

  beforeAll(async () => {
    server = app.listen(0);
    const user = await createTestUser();
    token = generateAuthToken(user.id);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should handle high load on main endpoints', (done) => {
    const instance = autocannon({
      url: `http://localhost:${(server.address() as any).port}`,
      connections: 100,
      duration: 10,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      requests: [
        {
          method: 'GET',
          path: '/api/users/profile',
        },
        {
          method: 'GET',
          path: '/api/messages',
        },
      ],
    });

    autocannon.track(instance);

    instance.on('done', (result) => {
      expect(result.errors).toBe(0);
      expect(result.timeouts).toBe(0);
      expect(result.non2xx).toBe(0);
      expect(result.latency.p99).toBeLessThan(1000); // 99th percentile under 1s
      done();
    });
  });
});
import Redis from 'ioredis-mock';
import { enqueueTask, processTask } from '../taskProcessor';

const redis = new Redis();

jest.mock('ioredis', () => require('ioredis-mock'));

describe('Task Queueing', () => {
  beforeEach(() => {
    redis.flushall();
  });

  it('should enqueue tasks', async () => {
    await enqueueTask('user1');
    const queueLength = await redis.llen('queue:user1');
    expect(queueLength).toBe(1);
  });

  it('should process tasks at a rate of 1 per second', async () => {
    jest.setTimeout(5000);
    const startTime = Date.now();
    await Promise.all([
      enqueueTask('user1'),
      enqueueTask('user1'),
      enqueueTask('user1'),
    ]);
    await new Promise(resolve => setTimeout(resolve, 3500));
    const endTime = Date.now();
    const duration = endTime - startTime;
    expect(duration).toBeGreaterThanOrEqual(3000);
    expect(duration).toBeLessThan(3500);
  });
});
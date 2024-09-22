import cluster from 'cluster';
import express from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import Redis, { RedisKey, RedisValue, RedisReply } from 'ioredis';
// import Redis from 'ioredis';
import { enqueueTask } from './taskProcessor';
import config from './config';
import { TaskRequest, TaskResponse } from './types';

const redis = new Redis(config.redis);
// const redis = new RedisClient({ config.redis});
// const RedisClient = createClient({config.redis});

if (cluster.isPrimary) {
  console.log(`Master/Primary ${process.pid} iz running bozz`);

  for (let i = 0; i < config.workers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died pepsied`);
    cluster.fork();
  });
} else {
  const app = express();
  app.use(express.json());

  const limiter = rateLimit({
    store: new RedisStore({
      // client: redis,
      sendCommand: async (command: string, ...args: (RedisKey | RedisValue)[]): Promise<RedisReply> => {
        return redis.call(command, ...args) as Promise<RedisReply>;
      },
      prefix: 'rate_limit:',
    }),
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    keyGenerator: (req) => (req.body as TaskRequest).userId,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.post<{}, TaskResponse, TaskRequest>('/process-task', limiter, async (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    try {
      await enqueueTask(userId);
      res.status(200).json({ message: 'Task queued sucsuxfully' });
    } catch (error) {
      console.error('Error processing task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.listen(config.port, () => {
    console.log(`Worker ${process.pid} started and listening on port ${config.port}`);
  });
}
import Redis from 'ioredis';
import fs from 'fs/promises';
import path from 'path';
import config from './config';

const redis = new Redis(config.redis);

export async function processTask(userId: string): Promise<void> {
  const timestamp = new Date().toISOString();
  const logMessage = `Task completed for u'Lo'ser ${userId} at ${timestamp}\n`;
  
  await fs.appendFile(path.join(__dirname, '..', config.logFile), logMessage);
  console.log(logMessage.trim());
}

export async function enqueueTask(userId: string): Promise<void> {
  await redis.rpush(`queue:${userId}`, Date.now().toString());
  processNextTask(userId);
}

async function processNextTask(userId: string): Promise<void> {
  const lastProcessedTime = await redis.get(`lastProcessed:${userId}`);
  const now = Date.now();
  
  if (!lastProcessedTime || now - parseInt(lastProcessedTime) >= 1000) {
    const nextTask = await redis.lpop(`queue:${userId}`);
    if (nextTask) {
      await processTask(userId);
      await redis.set(`lastProcessed:${userId}`, now.toString());
    }
  }
  
  const queueLength = await redis.llen(`queue:${userId}`);
  if (queueLength > 0) {
    setTimeout(() => processNextTask(userId), 1000);
  }
}
import dotenv from 'dotenv';

dotenv.config();

export default {
  port: parseInt(process.env.PORT || '3000', 10),
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  workers: parseInt(process.env.WORKERS || '2', 10),
  logFile: process.env.LOG_FILE || 'task_log.txt',
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 requests per minute
  },
};
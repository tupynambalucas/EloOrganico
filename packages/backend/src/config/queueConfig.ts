import { Queue } from 'bullmq'; 
import IORedis from 'ioredis';

const getRedisConfig = () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

export const connection = new IORedis(getRedisConfig());

export const CYCLE_QUEUE_NAME = 'cycle-management-queue';

export const cycleQueue = new Queue(CYCLE_QUEUE_NAME, { connection });
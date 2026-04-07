import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { Worker } from 'bullmq';
import { cycleQueue, CYCLE_QUEUE_NAME, connection } from '../config/queueConfig.js';
import type { CycleService } from '../domains/cycle/cycle.service.js';

interface QueuePluginOptions {
  cycleService: CycleService;
}

const queuePlugin: FastifyPluginAsync<QueuePluginOptions> = async (server, opts) => {
  const { cycleService } = opts;
  const worker = new Worker(
    CYCLE_QUEUE_NAME,
    async (job) => {
      if (job.name === 'archive-expired-cycles') {
        server.log.info('[Queue] Processando arquivamento de ciclos...');
        await cycleService.performScheduledArchival();
      }
    },
    {
      connection,
      concurrency: 1,
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 500 },
    },
  );

  worker.on('completed', (job) => {
    server.log.info(`[Queue] Job ${job.id} completado.`);
  });

  worker.on('failed', (job, err) => {
    server.log.error(err, `[Queue] Job ${job?.id} falhou.`);
  });

  const scheduleJobs = async () => {
    await cycleQueue.add(
      'archive-expired-cycles',
      {},
      {
        repeat: {
          pattern: '0 * * * *', // In every o'clock
        },
        jobId: 'archive-expired-cycles-cron',
      },
    );
    server.log.info('[Queue] Job de arquivamento agendado.');
  };

  await scheduleJobs();

  server.addHook('onClose', async () => {
    await worker.close();
    await cycleQueue.close();
  });
};

export default fp(queuePlugin);

import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const utilsPlugin: FastifyPluginAsync = async (server) => {
  server.decorate(
    'convertTimeToSeconds',
    async (type: 'minutes' | 'hours' | 'days', time: number) => {
      switch (type) {
        case 'minutes':
          return time * 60;
        case 'hours':
          return time * 3600;
        case 'days':
          return time * 24 * 60 * 60;
        default:
          return undefined;
      }
    }
  );
};

export default fp(utilsPlugin);
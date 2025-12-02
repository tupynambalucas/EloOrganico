import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { resolve } from 'node:path';
import { networkInterfaces } from 'node:os';

// Define the types for the new decorators.
// This uses module augmentation to add them to the FastifyInstance interface.

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
          // Returns undefined for invalid types.
          return undefined;
      }
    }
  );
};

export default fp(utilsPlugin);
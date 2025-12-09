import Fastify from 'fastify';
import type { FastifyInstance } from "fastify"
const server: FastifyInstance = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: '@fastify/one-line-logger',
      options: {
        customColors: {
          info: 'blue',
          warn: 'yellow',
          error: 'red',
          debug: 'green',
        },
        colorize: true,
      },
    },
  },
});

export default server
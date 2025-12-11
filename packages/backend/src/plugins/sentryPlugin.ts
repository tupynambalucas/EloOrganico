import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { AppError } from '../utils/AppError';

const sentryPlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  if (!server.config.SENTRY_DSN) return;

  Sentry.init({
    dsn: server.config.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    environment: server.config.NODE_ENV,
    beforeSend(event, hint) {
      const error = hint.originalException;

      if (error instanceof AppError) {
        return null;
      }

      if (error && typeof error === 'object' && 'statusCode' in error) {
        const status = (error as any).statusCode;
        if (typeof status === 'number' && status < 500) {
          return null;
        }
      }

      return event;
    },
  });
};

export default fp(sentryPlugin);
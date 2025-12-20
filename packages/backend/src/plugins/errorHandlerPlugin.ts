import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/node';
import { AppError } from '../utils/AppError';

const errorHandlerPlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.setErrorHandler((error: any, request, reply) => {
    if (error instanceof ZodError) {
      request.log.warn({ type: 'Validation Error', issues: error.issues }, 'Falha de validação (Zod)');
      return reply.status(400).send({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        issues: error.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message }))
      });
    }

    if (error instanceof AppError) {
      request.log.info({ type: 'AppError', statusCode: error.statusCode, code: error.code }, error.message);
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        code: error.code
      });
    }

    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      request.log.info({ type: 'Client Error', statusCode: statusCode }, error.message);
      return reply.status(statusCode).send({
        statusCode,
        code: error.code || 'UNKNOWN_CLIENT_ERROR'
      });
    }

    request.log.error({ err: error }, 'Internal Server Error');
    Sentry.captureException(error);

    return reply.status(500).send({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR'
    });
  });
};

export default fp(errorHandlerPlugin);
import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/node';
import { AppError } from '../utils/AppError';

interface IFastifyError extends Error {
  statusCode?: number;
  code?: string;
}

const errorHandlerPlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.setErrorHandler((error: unknown, request, reply) => {
    const err = error as IFastifyError;
    const message = err.message || 'Erro desconhecido';

    if (error instanceof ZodError) {
      request.log.warn({ type: 'Validation Error', issues: error.issues }, 'Falha de validação (Zod)');
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Erro de validação nos dados enviados.',
        issues: error.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message }))
      });
    }

    if (error instanceof AppError) {
      request.log.info({ type: 'AppError', statusCode: error.statusCode, code: error.code }, error.message);
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.statusCode >= 500 ? 'Server Error' : 'Bad Request',
        message: error.message,
        code: error.code
      });
    }

    const statusCode = err.statusCode || 500;

    if (statusCode >= 400 && statusCode < 500) {
      request.log.info({ type: 'Client Error', statusCode: statusCode }, message);
      return reply.status(statusCode).send({
        statusCode,
        error: err.name || 'Bad Request',
        message: message
      });
    }

    if (server.config.SENTRY_DSN) {
      Sentry.captureException(error);
    }

    request.log.error(error);
    
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Ocorreu um erro interno no servidor.'
    });
  });
};

export default fp(errorHandlerPlugin);
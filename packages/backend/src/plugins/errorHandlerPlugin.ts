import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/node';
import { AppError } from '../utils/AppError.js';

const errorHandlerPlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.setErrorHandler((error: any, request, reply) => {
    // Log detalhado para o console em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      request.log.error(error);
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        issues: error.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message }))
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        code: error.code
      });
    }

    // Erros de autenticação do Fastify (JWT/Session)
    if (error.statusCode === 401) {
      return reply.status(401).send({
        statusCode: 401,
        code: 'NOT_AUTHENTICATED'
      });
    }

    const statusCode = error.statusCode || 500;
    if (statusCode < 500) {
      return reply.status(statusCode).send({
        statusCode,
        code: error.code || 'UNKNOWN_CLIENT_ERROR'
      });
    }

    // Erros 500 reais
    Sentry.captureException(error);
    return reply.status(500).send({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR'
    });
  });
};

export default fp(errorHandlerPlugin);
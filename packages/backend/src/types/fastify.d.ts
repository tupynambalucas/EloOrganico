import { Model, Mongoose, Document } from 'mongoose';
import { 
  FastifyRequest, 
  FastifyReply, 
  FastifySchema,
  RouteHandlerMethod, 
  ContextConfigDefault,
  RawServerDefault
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import '@fastify/session'; 
import '@fastify/jwt'; 
import { type IUser, type IProduct } from '@elo-organico/shared';

import { AuthController } from '../domains/auth/auth.controller';
import { CycleController } from '../domains/cycle/cycle.controller';
import { ProductController } from '../domains/product/product.controller';

import { CycleService } from '../domains/cycle/cycle.service'; // [NOVO]

import { ICycleDocument } from '../models/cycle.model'; 

export type UserPayload = Pick<IUser, 'email' | 'username' | 'role' | 'icon'> & { 
    _id: string;
    iat?: number;
    exp?: number;
};

export type FastifyZodHandler<TSchema extends FastifySchema> = RouteHandlerMethod<
  RawServerDefault,
  import('fastify').RawRequestDefaultExpression,
  import('fastify').RawReplyDefaultExpression,
  never,
  ContextConfigDefault,
  TSchema,
  ZodTypeProvider
>;

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: UserPayload;
    user: UserPayload;
  }
}

declare module 'fastify' {
    interface Session {
      token?: string;
    }

    interface FastifyInstance {
        authController: AuthController;
        cycleController: CycleController;
        productController: ProductController;
        
        cycleService: CycleService; // [NOVO]
        
        models: {
            User: Model<Omit<IUser, '_id'> & Document & { password?: string }>;
            Product: Model<Omit<IProduct, '_id'> & Document>;
            Cycle: Model<ICycleDocument>; 
        };
        
        mongoose: Mongoose;
        
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        verifyAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        
        convertTimeToSeconds(
            type: 'minutes' | 'hours' | 'days',
            time: number
        ): Promise<number | undefined>;
        
        genHash(password: string): Promise<string | Error>;
        compareHash(password: string, hashedPass: string): Promise<boolean | Error>;
        
        config: {
            SERVER_HOST: string;
            SERVER_PORT: number;
            JWT_SECRET: string;
            NODE_ENV: string;
            SESSION_SECRET: string;
            MONGO_URI: string;
            ADMIN_USER_SEED: string;
            ADMIN_EMAIL_SEED: string;
            ADMIN_PASS_SEED: string;
            USER_SESSION_KEY: string;
            SENTRY_DSN?: string;
            REDIS_HOST?: string; // [NOVO]
            REDIS_PORT?: number; // [NOVO]
        };
    }
}
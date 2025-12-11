import { Model, Mongoose, Document, Types } from 'mongoose';
import { 
  FastifyRequest, 
  FastifyReply, 
  FastifyInstance, 
  RawServerDefault, 
  FastifySchema,
  RouteHandlerMethod, 
  ContextConfigDefault
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import '@fastify/session'; 
import '@fastify/jwt'; 
import { type IUser, type IProduct, type ICycle } from '@elo-organico/shared';
import { AuthController } from '../features/auth/auth.controller';
import { CycleController } from '../features/cycle/cycle.controller';
import { ProductController } from '../features/product/product.controller';

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
        
        models: {
            User: Model<Omit<IUser, '_id'> & Document & { password?: string }>;
            Product: Model<Omit<IProduct, '_id'> & Document>;
            Cycle: Model<
                Omit<ICycle, '_id' | 'products' | 'openingDate' | 'closingDate'> & 
                Document & { 
                    products: Types.ObjectId[]; 
                    openingDate: Date;
                    closingDate: Date;
                }
            >; 
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
        };
    }
}
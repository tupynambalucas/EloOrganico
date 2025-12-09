import { Model, Mongoose, Document, Types } from 'mongoose';
import { 
  FastifyRequest, 
  FastifyReply, 
  FastifyInstance, 
  RawServerDefault, 
  FastifySchema,
  RouteHandlerMethod, 
  FastifyBaseLogger,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  ContextConfigDefault
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { IncomingMessage, ServerResponse } from 'http';
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

// --- A CORREÇÃO DEFINITIVA (Schema-Based Handler) ---
// Este tipo aceita o TSchema (o objeto Zod) e gera a assinatura exata que o Router espera.
export type FastifyZodHandler<TSchema extends FastifySchema> = RouteHandlerMethod<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  never, // RouteGenericInterface é ignorado quando usamos TypeProvider
  ContextConfigDefault,
  TSchema, // O Schema entra aqui
  ZodTypeProvider
>;

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserPayload;
  }
}

declare module 'fastify' {
    interface Session {
        token?: string;
        user?: UserPayload;
    }

    interface FastifyInstance {
        authController: AuthController;
        cycleController: CycleController;
        productController: ProductController;

        getNetworkInterface(): Promise<string | undefined>;
        getProjectRoot(): string;
        getServerRoot(): string;
        
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
        };
    }

    interface FastifyRequest {
        user: UserPayload;
    }
}
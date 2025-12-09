import { Model, Mongoose, Document, Types } from 'mongoose';
import { 
  FastifyRequest, 
  FastifyReply, 
  FastifyInstance, 
  RawServerDefault, 
  FastifySchema,
  RouteGenericInterface,
  RouteHandler // Importante
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { IncomingMessage, ServerResponse } from 'http';
import '@fastify/session'; 
import '@fastify/jwt'; 
import { type IUser, type IProduct, type ICycle } from '@elo-organico/shared';
import { AuthController } from '../features/auth/auth.controller';
import { CycleController } from '../features/cycles/cycle.controller';
import { ProductController } from '../features/products/product.controller';

export type UserPayload = Pick<IUser, 'email' | 'username' | 'role' | 'icon'> & { 
    _id: string;
    iat?: number;
    exp?: number;
};

// --- TIPO UTILITÁRIO PARA HANDLERS (A SOLUÇÃO DO ERRO) ---
// Em vez de tipar o 'req', tipamos a função inteira.
export type FastifyZodHandler<
  RouteGeneric extends RouteGenericInterface
> = RouteHandler<
  RouteGeneric,
  RawServerDefault,
  IncomingMessage,
  ServerResponse,
  FastifySchema,
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
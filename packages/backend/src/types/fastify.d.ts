import { Model, Mongoose } from 'mongoose';
import 'fastify';
import { type IUser, userSchema } from '../models/User';
import { type IProduct, productSchema } from '../models/Product';
import { type ICycle, cycleSchema } from '../models/Cycle';

declare module 'fastify' {
    interface FastifyInstance {
        getNetworkInterface(): Promise<string | undefined>;
        getProjectRoot(): string;
        getServerRoot(): string;
        
        // ADICIONADO: 'models' irá conter todos os modelos da aplicação
        models: {
            User: Model<IUser>;
            Product: Model<IProduct>; // Adicionado
            Cycle: Model<ICycle>;
        };
        mongoose: Mongoose;
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
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
            SESSION_SECRET: string;
            MONGO_URI: string;
        };
    }
    interface FastifyRequest {
        user: { 
            _id: string;
            username: string;
            iat: number;
            role: 'user' | 'admin';
            icon: string
        }
    }
    interface Session {
        token?: string;
    }
}
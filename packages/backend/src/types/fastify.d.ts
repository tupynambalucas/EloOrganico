import { Model, Mongoose, Document, Types } from 'mongoose';
import 'fastify';
import { type IUser, type IProduct, type ICycle } from '@elo-organico/shared';

declare module 'fastify' {
    interface FastifyInstance {
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
            ADMIN_USER_SEED: string;
            ADMIN_EMAIL_SEED: string;
            ADMIN_PASS_SEED: string;
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
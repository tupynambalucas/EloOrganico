import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    username: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    icon: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["user", "admin"]>>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
    icon: string;
    role: "user" | "admin";
    _id?: string | undefined;
    password?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}, {
    email: string;
    username: string;
    icon: string;
    _id?: string | undefined;
    password?: string | undefined;
    role?: "user" | "admin" | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}>;
export type IUser = z.infer<typeof UserSchema>;
//# sourceMappingURL=user.d.ts.map
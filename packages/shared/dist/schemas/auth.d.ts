import { z } from 'zod';
export declare const RegisterDTOSchema: z.ZodObject<Pick<{
    _id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    username: z.ZodString;
    password: z.ZodOptional<z.ZodString>;
    icon: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["user", "admin"]>>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "email" | "username" | "icon"> & {
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
    password: string;
    icon: string;
}, {
    email: string;
    username: string;
    password: string;
    icon: string;
}>;
export declare const LoginDTOSchema: z.ZodObject<{
    identifier: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    identifier: string;
}, {
    password: string;
    identifier: string;
}>;
export type RegisterDTO = z.infer<typeof RegisterDTOSchema>;
export type LoginDTO = z.infer<typeof LoginDTOSchema>;
//# sourceMappingURL=auth.d.ts.map
import { z } from 'zod';
export declare const MeasureSchema: z.ZodObject<{
    value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    type: z.ZodString;
    minimumOrder: z.ZodOptional<z.ZodObject<{
        type: z.ZodString;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "strip", z.ZodTypeAny, {
        value: string | number;
        type: string;
    }, {
        value: string | number;
        type: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    value: string | number;
    type: string;
    minimumOrder?: {
        value: string | number;
        type: string;
    } | undefined;
}, {
    value: string | number;
    type: string;
    minimumOrder?: {
        value: string | number;
        type: string;
    } | undefined;
}>;
export declare const ProductSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    category: z.ZodString;
    measure: z.ZodObject<{
        value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        type: z.ZodString;
        minimumOrder: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        }, "strip", z.ZodTypeAny, {
            value: string | number;
            type: string;
        }, {
            value: string | number;
            type: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        value: string | number;
        type: string;
        minimumOrder?: {
            value: string | number;
            type: string;
        } | undefined;
    }, {
        value: string | number;
        type: string;
        minimumOrder?: {
            value: string | number;
            type: string;
        } | undefined;
    }>;
    available: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    category: string;
    measure: {
        value: string | number;
        type: string;
        minimumOrder?: {
            value: string | number;
            type: string;
        } | undefined;
    };
    available: boolean;
    _id?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}, {
    name: string;
    category: string;
    measure: {
        value: string | number;
        type: string;
        minimumOrder?: {
            value: string | number;
            type: string;
        } | undefined;
    };
    _id?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    available?: boolean | undefined;
}>;
export type IMeasure = z.infer<typeof MeasureSchema>;
export type IProduct = z.infer<typeof ProductSchema>;
//# sourceMappingURL=product.d.ts.map
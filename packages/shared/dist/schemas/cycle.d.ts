import { z } from 'zod';
export declare const CycleSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    openingDate: z.ZodString;
    closingDate: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
    products: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
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
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    description: string;
    openingDate: string;
    closingDate: string;
    isActive: boolean;
    products: (string | {
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
    })[];
    _id?: string | undefined;
}, {
    description: string;
    openingDate: string;
    closingDate: string;
    products: (string | {
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
    })[];
    _id?: string | undefined;
    isActive?: boolean | undefined;
}>;
export declare const CreateCycleDTOSchema: z.ZodObject<{
    description: z.ZodString;
    openingDate: z.ZodString;
    closingDate: z.ZodString;
    products: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    description: string;
    openingDate: string;
    closingDate: string;
    products: {
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
    }[];
}, {
    description: string;
    openingDate: string;
    closingDate: string;
    products: {
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
    }[];
}>;
export type ICycle = z.infer<typeof CycleSchema>;
export type CreateCycleDTO = z.infer<typeof CreateCycleDTOSchema>;
//# sourceMappingURL=cycle.d.ts.map
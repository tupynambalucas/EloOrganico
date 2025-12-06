"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = exports.MeasureSchema = void 0;
const zod_1 = require("zod");
exports.MeasureSchema = zod_1.z.object({
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
    type: zod_1.z.string(),
    minimumOrder: zod_1.z.object({
        type: zod_1.z.string(),
        value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()])
    }).optional()
});
exports.ProductSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, "Nome é obrigatório"),
    category: zod_1.z.string().min(1, "Categoria é obrigatória"),
    measure: exports.MeasureSchema,
    available: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional()
});
//# sourceMappingURL=product.js.map
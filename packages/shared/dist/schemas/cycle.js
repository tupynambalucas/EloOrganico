"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCycleDTOSchema = exports.CycleSchema = void 0;
const zod_1 = require("zod");
const product_1 = require("./product");
exports.CycleSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    description: zod_1.z.string(),
    openingDate: zod_1.z.string().datetime(),
    closingDate: zod_1.z.string().datetime(),
    isActive: zod_1.z.boolean().default(true),
    products: zod_1.z.array(zod_1.z.union([zod_1.z.string(), product_1.ProductSchema])),
});
exports.CreateCycleDTOSchema = zod_1.z.object({
    description: zod_1.z.string(),
    openingDate: zod_1.z.string().datetime(),
    closingDate: zod_1.z.string().datetime(),
    products: zod_1.z.array(product_1.ProductSchema)
});
//# sourceMappingURL=cycle.js.map
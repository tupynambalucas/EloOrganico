"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../constants");
exports.UserSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    email: zod_1.z.string().email("Email inválido").max(constants_1.AUTH_RULES.EMAIL.MAX),
    username: zod_1.z.string().min(constants_1.AUTH_RULES.USERNAME.MIN).max(constants_1.AUTH_RULES.USERNAME.MAX),
    password: zod_1.z.string().min(constants_1.AUTH_RULES.PASSWORD.MIN).optional(),
    icon: zod_1.z.string(),
    role: zod_1.z.enum(['user', 'admin']).default('user'),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional()
});
//# sourceMappingURL=user.js.map
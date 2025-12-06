"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDTOSchema = exports.RegisterDTOSchema = void 0;
const zod_1 = require("zod");
const user_1 = require("./user");
const constants_1 = require("../constants");
exports.RegisterDTOSchema = user_1.UserSchema.pick({
    email: true,
    username: true,
    icon: true
}).extend({
    password: zod_1.z.string().min(constants_1.AUTH_RULES.PASSWORD.MIN)
});
exports.LoginDTOSchema = zod_1.z.object({
    identifier: zod_1.z.string(),
    password: zod_1.z.string()
});
//# sourceMappingURL=auth.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.regSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.regSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(10).required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-z0-9]{3,30}$', 'i')).required(),
    confirmPassword: joi_1.default.ref('password'),
    email: joi_1.default.string().email(),
    phone: joi_1.default.string().length(11),
    nickname: joi_1.default.string(),
    avatar: joi_1.default.string(),
    gender: joi_1.default.number().valid(0, 1, 2),
    sort: joi_1.default.number(),
});
exports.loginSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(10).required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-z0-9]{3,30}$', 'i')).required(),
});

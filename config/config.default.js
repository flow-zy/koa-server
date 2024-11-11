"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.white_list = void 0;
// const dotenv = require('dotenv');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// module.exports = process.env;
exports.default = process.env;
exports.white_list = [
    /^\/static/,
    /^\/login/,
    /^\/register/,
    /^\/upload/,
    /^\/apidocs/,
    /^\/swagger-json/,
];

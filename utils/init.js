"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initApp = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const initApp = () => {
    // 创建日志目录
    const logPath = path_1.default.resolve(__dirname, '../../logs');
    if (!fs_1.default.existsSync(logPath)) {
        fs_1.default.mkdirSync(logPath, { recursive: true });
    }
};
exports.initApp = initApp;

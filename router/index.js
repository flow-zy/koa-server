"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const router = new koa_swagger_decorator_1.SwaggerRouter();
router.swagger({
    title: 'api 文档',
    description: 'api 文档',
    swaggerHtmlEndpoint: '/apidocs',
});
router.mapDir(node_path_1.default.resolve(__dirname, '../controllers'));
exports.default = router;

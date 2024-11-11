"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
let Log = class Log extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Comment)('ID'),
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Log.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('用户名'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Log.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('请求IP'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Log.prototype, "ip", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('请求方法'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Log.prototype, "method", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('请求浏览器'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Log.prototype, "browser", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('请求路径'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Log.prototype, "url", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('操作内容'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Log.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('操作状态 1:成功 2:失败'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Log.prototype, "status", void 0);
Log = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'log'
    })
], Log);
exports.default = Log;

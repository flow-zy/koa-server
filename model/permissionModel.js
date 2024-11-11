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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const roleModel_1 = __importDefault(require("./roleModel"));
const rolePermissionModel_1 = __importDefault(require("./rolePermissionModel"));
// 权限模型
let PermissionModel = class PermissionModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Comment)('id'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], PermissionModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('权限名称'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], PermissionModel.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('权限标识'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], PermissionModel.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('权限类型'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], PermissionModel.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('排序'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], PermissionModel.prototype, "sort", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('状态'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], PermissionModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('权限描述'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], PermissionModel.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => roleModel_1.default, () => rolePermissionModel_1.default),
    __metadata("design:type", Array)
], PermissionModel.prototype, "roles", void 0);
PermissionModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'permission' })
], PermissionModel);
exports.default = PermissionModel;

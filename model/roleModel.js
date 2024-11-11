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
const userModel_1 = __importDefault(require("./userModel"));
const roleUserModel_1 = __importDefault(require("./roleUserModel"));
const permissionModel_1 = __importDefault(require("./permissionModel"));
const rolePermissionModel_1 = __importDefault(require("./rolePermissionModel"));
const menuModel_1 = __importDefault(require("./menuModel"));
const roleMenuModel_1 = __importDefault(require("./roleMenuModel"));
let RoleModel = class RoleModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Comment)('id'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], RoleModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('角色名称'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(30)),
    __metadata("design:type", String)
], RoleModel.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('角色别名'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(30)),
    __metadata("design:type", String)
], RoleModel.prototype, "nickname", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('角色描述'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(30)),
    __metadata("design:type", String)
], RoleModel.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('角色状态'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], RoleModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('排序'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], RoleModel.prototype, "sort", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => userModel_1.default, () => roleUserModel_1.default),
    __metadata("design:type", Array)
], RoleModel.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => permissionModel_1.default, () => rolePermissionModel_1.default),
    __metadata("design:type", Array)
], RoleModel.prototype, "permissions", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => menuModel_1.default, () => roleMenuModel_1.default),
    __metadata("design:type", Array)
], RoleModel.prototype, "menus", void 0);
RoleModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'role' })
], RoleModel);
exports.default = RoleModel;

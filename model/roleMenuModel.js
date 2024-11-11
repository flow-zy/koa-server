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
const menuModel_1 = __importDefault(require("./menuModel"));
// 角色权限模型
let RoleMenuModel = class RoleMenuModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Comment)('id'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], RoleMenuModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('角色id'),
    (0, sequelize_typescript_1.ForeignKey)(() => roleModel_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], RoleMenuModel.prototype, "role_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('菜单id'),
    (0, sequelize_typescript_1.ForeignKey)(() => menuModel_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], RoleMenuModel.prototype, "menu_id", void 0);
RoleMenuModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'role_menu' })
], RoleMenuModel);
exports.default = RoleMenuModel;

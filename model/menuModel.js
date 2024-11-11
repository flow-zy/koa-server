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
// 菜单模型
let MenuModel = class MenuModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Comment)('id'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], MenuModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Comment)('菜单名称'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], MenuModel.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('菜单路劲'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], MenuModel.prototype, "path", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('菜单组件'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], MenuModel.prototype, "component", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('菜单图标'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], MenuModel.prototype, "icon", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('菜单重定向'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], MenuModel.prototype, "redirect", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('菜单排序'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], MenuModel.prototype, "sort", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('菜单类型'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], MenuModel.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('菜单状态'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], MenuModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('父级菜单id'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], MenuModel.prototype, "parentid", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('外链'),
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], MenuModel.prototype, "allowShow", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('是否启用'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], MenuModel.prototype, "allowUse", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('备注'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], MenuModel.prototype, "remark", void 0);
MenuModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'menu' })
], MenuModel);
exports.default = MenuModel;

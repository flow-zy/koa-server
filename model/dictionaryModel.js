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
let DictionaryModel = class DictionaryModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Comment)('id'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], DictionaryModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('字典名称'),
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], DictionaryModel.prototype, "dictname", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('字典值'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], DictionaryModel.prototype, "dictcode", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('字典类型 0:系统字典 1:业务字典'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], DictionaryModel.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('字典描述'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], DictionaryModel.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('父级ID'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], DictionaryModel.prototype, "parentid", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('字典排序'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], DictionaryModel.prototype, "sort", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('字典状态'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], DictionaryModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('字典备注'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DictionaryModel.prototype, "remark", void 0);
DictionaryModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'dictionary' })
], DictionaryModel);
exports.default = DictionaryModel;

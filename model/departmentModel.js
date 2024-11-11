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
let DepartmentModel = class DepartmentModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Comment)('ID'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], DepartmentModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('部门名称'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DepartmentModel.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('部门编码'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DepartmentModel.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('父级ID'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], DepartmentModel.prototype, "parentid", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('负责人ID'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], DepartmentModel.prototype, "leader_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('负责人'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DepartmentModel.prototype, "leader", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('联系电话'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DepartmentModel.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('邮箱'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DepartmentModel.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('排序'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], DepartmentModel.prototype, "sort", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('状态：0-禁用 1-启用'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], DepartmentModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('备注'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DepartmentModel.prototype, "remark", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => userModel_1.default),
    __metadata("design:type", Array)
], DepartmentModel.prototype, "users", void 0);
DepartmentModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'department' })
], DepartmentModel);
exports.default = DepartmentModel;

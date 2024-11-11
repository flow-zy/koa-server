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
let FileModel = class FileModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Comment)('ID'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], FileModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('文件名称'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileModel.prototype, "filename", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('原始文件名'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileModel.prototype, "original_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('文件路径'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileModel.prototype, "filepath", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('文件类型'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileModel.prototype, "mimetype", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('文件大小(字节)'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], FileModel.prototype, "size", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('文件分类：1-图片 2-文档 3-视频 4-音频 5-其他'),
    (0, sequelize_typescript_1.Default)(5),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], FileModel.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('存储位置：1-本地 2-云存储'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], FileModel.prototype, "storage", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('上传人ID'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], FileModel.prototype, "uploader_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('上传人'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileModel.prototype, "uploader", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('状态：0-禁用 1-启用'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], FileModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('备注'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileModel.prototype, "remark", void 0);
FileModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'file' })
], FileModel);
exports.default = FileModel;

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
let NoticeModel = class NoticeModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Comment)('ID'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], NoticeModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('标题'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], NoticeModel.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('内容'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], NoticeModel.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('类型：1-通知 2-公告'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], NoticeModel.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('状态：0-草稿 1-发布 2-撤回'),
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], NoticeModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('是否置顶：0-否 1-是'),
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], NoticeModel.prototype, "istop", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('发布人ID'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], NoticeModel.prototype, "publisher_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('发布人'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], NoticeModel.prototype, "publisher", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('发布时间'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], NoticeModel.prototype, "publish_time", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('排序'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], NoticeModel.prototype, "sort", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('备注'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], NoticeModel.prototype, "remark", void 0);
NoticeModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'notice' })
], NoticeModel);
exports.default = NoticeModel;

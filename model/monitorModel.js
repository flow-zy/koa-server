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
let MonitorModel = class MonitorModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Comment)('ID'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], MonitorModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('CPU使用率(%)'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], MonitorModel.prototype, "cpu_usage", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('内存使用率(%)'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], MonitorModel.prototype, "memory_usage", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('磁盘使用率(%)'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], MonitorModel.prototype, "disk_usage", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('系统负载'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], MonitorModel.prototype, "system_load", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('网络IO(KB/s)'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], MonitorModel.prototype, "network_io", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('在线用户数'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], MonitorModel.prototype, "online_users", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('系统运行时间(秒)'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], MonitorModel.prototype, "uptime", void 0);
MonitorModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'monitor' })
], MonitorModel);
exports.default = MonitorModel;

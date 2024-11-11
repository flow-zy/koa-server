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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const roleModel_1 = __importDefault(require("./roleModel"));
const roleUserModel_1 = __importDefault(require("./roleUserModel"));
const departmentModel_1 = __importDefault(require("./departmentModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let UserModel = class UserModel extends sequelize_typescript_1.Model {
    // 密码验证方法
    validatePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.default.compare(password, this.password);
        });
    }
    // 密码加密钩子
    static hashPassword(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            if (instance.changed('password')) {
                const salt = yield bcryptjs_1.default.genSalt(10);
                instance.password = yield bcryptjs_1.default.hash(instance.password, salt);
            }
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Comment)('ID'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], UserModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('用户名'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('密码'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('昵称'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "nickname", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('邮箱'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('手机号'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('头像'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], UserModel.prototype, "avatar", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('性别：0-未知 1-男 2-女'),
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], UserModel.prototype, "gender", void 0);
__decorate([
    (0, sequelize_typescript_1.Comment)('状态：0-禁用 1-启用'),
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], UserModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => departmentModel_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], UserModel.prototype, "department_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => departmentModel_1.default),
    __metadata("design:type", departmentModel_1.default)
], UserModel.prototype, "department", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => roleModel_1.default, () => roleUserModel_1.default),
    __metadata("design:type", Array)
], UserModel.prototype, "roles", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserModel]),
    __metadata("design:returntype", Promise)
], UserModel, "hashPassword", null);
UserModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'user' })
], UserModel);
exports.default = UserModel;

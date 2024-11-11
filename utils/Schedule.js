"use strict";
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
exports.staticInit = staticInit;
exports.deleteStatic = deleteStatic;
const node_schedule_1 = __importDefault(require("node-schedule"));
const config_default_1 = __importDefault(require("../config/config.default"));
// import redis from '../db/redis';
// import CommonServiceImpl from '../service/Implement/CommonServiceImpl';
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
// const commonService = new CommonServiceImpl();
// export const websiteVisit = () => {
// 	schedule.scheduleJob('59 23 * * *', async () => {
// 		console.log('定时任务执行');
// 		const count = await redis.get('website_visit_num');
// 		await redis.del('website_visit');
// 		const res = await commonService.addVisitNum(Number(count));
// 		return res;
// 	});
// };
function staticInit() {
    return __awaiter(this, void 0, void 0, function* () {
        const { NODE_ENV } = config_default_1.default;
        let staticPath;
        if (NODE_ENV === 'development') {
            staticPath = node_path_1.default.join('src', 'static');
        }
        else {
            staticPath = node_path_1.default.join('dist', 'static');
        }
        node_fs_1.default.stat(staticPath, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    node_fs_1.default.mkdir(staticPath, { recursive: true }, (err) => {
                        if (err) {
                            console.error('static创建失败:', err);
                        }
                        else {
                            console.log('static创建成功');
                        }
                    });
                }
                else {
                    console.error('Failed to check static directory:', err);
                }
            }
            else {
                console.log('static目录已经存在');
            }
        });
    });
}
function deleteStatic() {
    return __awaiter(this, void 0, void 0, function* () {
        const { NODE_ENV } = config_default_1.default;
        let staticPath;
        if (NODE_ENV === 'development') {
            staticPath = node_path_1.default.join('src', 'static');
        }
        else {
            staticPath = node_path_1.default.join('dist', 'static');
        }
        node_schedule_1.default.scheduleJob('55 23 * * *', () => __awaiter(this, void 0, void 0, function* () {
            node_fs_1.default.readdir(staticPath, (err, files) => {
                if (err) {
                    console.error('读取static失败:', err);
                }
                else {
                    files.forEach((file) => {
                        const filePath = node_path_1.default.join(staticPath, file);
                        node_fs_1.default.unlink(filePath, (err) => {
                            if (err) {
                                console.error(`static下文件删除失败: ${filePath}`, err);
                            }
                            else {
                                console.log(`static下文件删除成功: ${filePath}`);
                            }
                        });
                    });
                }
            });
        }));
    });
}

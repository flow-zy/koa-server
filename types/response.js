"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = void 0;
// 状态码枚举
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["SUCCESS"] = 200] = "SUCCESS";
    StatusCode[StatusCode["ERROR"] = 201] = "ERROR";
    StatusCode[StatusCode["PARAMS_ERROR"] = 202] = "PARAMS_ERROR";
    StatusCode[StatusCode["AUTH_ERROR"] = 401] = "AUTH_ERROR";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED"; // 未授权
})(StatusCode || (exports.StatusCode = StatusCode = {}));

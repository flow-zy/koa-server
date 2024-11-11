"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiActions = void 0;
var ApiActions;
(function (ApiActions) {
    // 文档
    ApiActions["/apidocs"] = "\u8BBF\u95EEapi\u6587\u6863";
    ApiActions["/swagger-json"] = "\u8BBF\u95EEswagger\u6587\u6863";
    ApiActions["/favicon.ico"] = "\u8BBF\u95EEfavicon";
    // 登录
    ApiActions["/login"] = "\u767B\u5F55";
    ApiActions["/logout"] = "\u9000\u51FA";
    ApiActions["/register"] = "\u7BA1\u7406\u5458\u6CE8\u518C";
    ApiActions["/admin/info"] = "\u83B7\u53D6\u7BA1\u7406\u5458\u4FE1\u606F";
    // 用户
    ApiActions["/user/info"] = "\u83B7\u53D6\u7528\u6237\u4FE1\u606F";
    ApiActions["/user/list"] = "\u83B7\u53D6\u7528\u6237\u5217\u8868";
    ApiActions["/user/add"] = "\u521B\u5EFA\u7528\u6237";
    ApiActions["/user/update"] = "\u66F4\u65B0\u7528\u6237";
    ApiActions["/user/delete"] = "\u5220\u9664\u7528\u6237";
    ApiActions["/user/status"] = "\u4FEE\u6539\u7528\u6237\u72B6\u6001";
    // 角色
    ApiActions["/role/list"] = "\u83B7\u53D6\u89D2\u8272\u5217\u8868";
    ApiActions["/role/all"] = "\u83B7\u53D6\u6240\u6709\u89D2\u8272";
    ApiActions["/role/add"] = "\u521B\u5EFA\u89D2\u8272";
    ApiActions["/role/update"] = "\u66F4\u65B0\u89D2\u8272";
    ApiActions["/role/delete"] = "\u5220\u9664\u89D2\u8272";
    ApiActions["/role/status"] = "\u4FEE\u6539\u89D2\u8272\u72B6\u6001";
    // 权限
    ApiActions["/permission/list"] = "\u83B7\u53D6\u6743\u9650\u5217\u8868";
    ApiActions["/permission/all"] = "\u83B7\u53D6\u6240\u6709\u6743\u9650";
    ApiActions["/permission/add"] = "\u521B\u5EFA\u6743\u9650";
    ApiActions["/permission/update"] = "\u66F4\u65B0\u6743\u9650";
    ApiActions["/permission/delete"] = "\u5220\u9664\u6743\u9650";
    ApiActions["/permission/status"] = "\u4FEE\u6539\u6743\u9650\u72B6\u6001";
    // 菜单
    ApiActions["/menu/list"] = "\u83B7\u53D6\u83DC\u5355\u5217\u8868";
    ApiActions["/menu/all"] = "\u83B7\u53D6\u6240\u6709\u83DC\u5355";
    ApiActions["/menu/add"] = "\u521B\u5EFA\u83DC\u5355";
    ApiActions["/menu/update"] = "\u66F4\u65B0\u83DC\u5355";
    ApiActions["/menu/delete"] = "\u5220\u9664\u83DC\u5355";
    ApiActions["/menu/status"] = "\u4FEE\u6539\u83DC\u5355\u72B6\u6001";
    // 日志
    ApiActions["/log/list"] = "\u83B7\u53D6\u65E5\u5FD7\u5217\u8868";
    // 字典
    ApiActions["/dictionary/list"] = "\u83B7\u53D6\u5B57\u5178\u5217\u8868";
    ApiActions["/dictionary/all"] = "\u83B7\u53D6\u6240\u6709\u5B57\u5178";
    ApiActions["/dictionary/add"] = "\u521B\u5EFA\u5B57\u5178";
    ApiActions["/dictionary/update"] = "\u66F4\u65B0\u5B57\u5178";
    ApiActions["/dictionary/delete"] = "\u5220\u9664\u5B57\u5178";
    ApiActions["/dictionary/status"] = "\u4FEE\u6539\u5B57\u5178\u72B6\u6001";
    // 文件
    ApiActions["/upload"] = "\u4E0A\u4F20\u6587\u4EF6";
    ApiActions["/file/delete"] = "\u5220\u9664\u6587\u4EF6";
})(ApiActions || (exports.ApiActions = ApiActions = {}));

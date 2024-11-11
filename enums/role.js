"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMessage = void 0;
var RoleMessage;
(function (RoleMessage) {
    // 列表相关
    RoleMessage["ROLE_LIST_SUCCESS"] = "\u83B7\u53D6\u89D2\u8272\u5217\u8868\u6210\u529F";
    RoleMessage["ROLE_LIST_ERROR"] = "\u83B7\u53D6\u89D2\u8272\u5217\u8868\u5931\u8D25";
    // 添加相关
    RoleMessage["ROLE_ADD_SUCCESS"] = "\u6DFB\u52A0\u89D2\u8272\u6210\u529F";
    RoleMessage["ROLE_ADD_ERROR"] = "\u6DFB\u52A0\u89D2\u8272\u5931\u8D25";
    RoleMessage["ROLE_EXISTS"] = "\u89D2\u8272\u5DF2\u5B58\u5728";
    // 更新相关
    RoleMessage["ROLE_UPDATE_SUCCESS"] = "\u4FEE\u6539\u89D2\u8272\u6210\u529F";
    RoleMessage["ROLE_UPDATE_ERROR"] = "\u4FEE\u6539\u89D2\u8272\u5931\u8D25";
    // 删除相关
    RoleMessage["ROLE_DELETE_SUCCESS"] = "\u5220\u9664\u89D2\u8272\u6210\u529F";
    RoleMessage["ROLE_DELETE_ERROR"] = "\u5220\u9664\u89D2\u8272\u5931\u8D25";
    // 状态相关
    RoleMessage["ROLE_STATUS_SUCCESS"] = "\u4FEE\u6539\u89D2\u8272\u72B6\u6001\u6210\u529F";
    RoleMessage["ROLE_STATUS_ERROR"] = "\u4FEE\u6539\u89D2\u8272\u72B6\u6001\u5931\u8D25";
    // 参数相关
    RoleMessage["ROLE_PARAMS_ERROR"] = "\u89D2\u8272\u53C2\u6570\u9519\u8BEF";
    RoleMessage["ROLE_NAME_REQUIRED"] = "\u89D2\u8272\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A";
    // 权限相关
    RoleMessage["ROLE_PERMISSION_ERROR"] = "\u89D2\u8272\u6743\u9650\u8BBE\u7F6E\u5931\u8D25";
    RoleMessage["ROLE_PERMISSION_SUCCESS"] = "\u89D2\u8272\u6743\u9650\u8BBE\u7F6E\u6210\u529F";
    // 其他
    RoleMessage["ROLE_NOT_FOUND"] = "\u89D2\u8272\u4E0D\u5B58\u5728";
    RoleMessage["ROLE_OPERATION_ERROR"] = "\u89D2\u8272\u64CD\u4F5C\u5931\u8D25";
    // 错误消息
    RoleMessage["ROLE_ID_REQUIRED"] = "\u89D2\u8272ID\u4E0D\u80FD\u4E3A\u7A7A";
    RoleMessage["ROLE_NOT_EXIST"] = "\u89D2\u8272\u4E0D\u5B58\u5728";
    RoleMessage["ROLE_CODE_REQUIRED"] = "\u89D2\u8272\u7F16\u7801\u4E0D\u80FD\u4E3A\u7A7A";
    RoleMessage["ROLE_EXIST"] = "\u89D2\u8272\u5DF2\u5B58\u5728";
    // 系统错误
    RoleMessage["SYSTEM_ERROR"] = "\u7CFB\u7EDF\u9519\u8BEF\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458";
    // 获取角色详情
    RoleMessage["GET_ROLE_DETAIL_SUCCESS"] = "\u83B7\u53D6\u89D2\u8272\u8BE6\u60C5\u6210\u529F";
    RoleMessage["GET_ROLE_DETAIL_ERROR"] = "\u83B7\u53D6\u89D2\u8272\u8BE6\u60C5\u5931\u8D25";
})(RoleMessage || (exports.RoleMessage = RoleMessage = {}));

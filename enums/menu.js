"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuMessage = void 0;
var MenuMessage;
(function (MenuMessage) {
    // 列表相关
    MenuMessage["MENU_LIST_SUCCESS"] = "\u83B7\u53D6\u83DC\u5355\u5217\u8868\u6210\u529F";
    MenuMessage["MENU_LIST_ERROR"] = "\u83B7\u53D6\u83DC\u5355\u5217\u8868\u5931\u8D25";
    // 添加相关
    MenuMessage["MENU_ADD_SUCCESS"] = "\u6DFB\u52A0\u83DC\u5355\u6210\u529F";
    MenuMessage["MENU_ADD_ERROR"] = "\u6DFB\u52A0\u83DC\u5355\u5931\u8D25";
    MenuMessage["MENU_EXISTS"] = "\u83DC\u5355\u5DF2\u5B58\u5728";
    // 更新相关
    MenuMessage["MENU_UPDATE_SUCCESS"] = "\u4FEE\u6539\u83DC\u5355\u6210\u529F";
    MenuMessage["MENU_UPDATE_ERROR"] = "\u4FEE\u6539\u83DC\u5355\u5931\u8D25";
    // 删除相关
    MenuMessage["MENU_DELETE_SUCCESS"] = "\u5220\u9664\u83DC\u5355\u6210\u529F";
    MenuMessage["MENU_DELETE_ERROR"] = "\u5220\u9664\u83DC\u5355\u5931\u8D25";
    // 状态相关
    MenuMessage["MENU_STATUS_SUCCESS"] = "\u4FEE\u6539\u83DC\u5355\u72B6\u6001\u6210\u529F";
    MenuMessage["MENU_STATUS_ERROR"] = "\u4FEE\u6539\u83DC\u5355\u72B6\u6001\u5931\u8D25";
    // 参数相关
    MenuMessage["MENU_PARAMS_ERROR"] = "\u83DC\u5355\u53C2\u6570\u9519\u8BEF";
    MenuMessage["MENU_NAME_REQUIRED"] = "\u83DC\u5355\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A";
    MenuMessage["MENU_PATH_REQUIRED"] = "\u83DC\u5355\u8DEF\u5F84\u4E0D\u80FD\u4E3A\u7A7A";
    // 父级菜单相关
    MenuMessage["MENU_PARENT_NOT_FOUND"] = "\u7236\u7EA7\u83DC\u5355\u4E0D\u5B58\u5728";
    MenuMessage["MENU_PARENT_ERROR"] = "\u4E0D\u80FD\u5C06\u83DC\u5355\u8BBE\u7F6E\u4E3A\u81EA\u5DF1\u7684\u5B50\u83DC\u5355";
    // 其他
    MenuMessage["MENU_NOT_FOUND"] = "\u83DC\u5355\u4E0D\u5B58\u5728";
    MenuMessage["MENU_OPERATION_ERROR"] = "\u83DC\u5355\u64CD\u4F5C\u5931\u8D25";
    MenuMessage["MENU_HAS_CHILDREN"] = "\u8BE5\u83DC\u5355\u4E0B\u5B58\u5728\u5B50\u83DC\u5355\uFF0C\u65E0\u6CD5\u64CD\u4F5C";
})(MenuMessage || (exports.MenuMessage = MenuMessage = {}));

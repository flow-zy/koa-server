"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictionaryMessage = void 0;
var DictionaryMessage;
(function (DictionaryMessage) {
    // 列表相关
    DictionaryMessage["DICT_LIST_SUCCESS"] = "\u83B7\u53D6\u5B57\u5178\u5217\u8868\u6210\u529F";
    DictionaryMessage["DICT_LIST_ERROR"] = "\u83B7\u53D6\u5B57\u5178\u5217\u8868\u5931\u8D25";
    // 添加相关
    DictionaryMessage["DICT_ADD_SUCCESS"] = "\u6DFB\u52A0\u5B57\u5178\u6210\u529F";
    DictionaryMessage["DICT_ADD_ERROR"] = "\u6DFB\u52A0\u5B57\u5178\u5931\u8D25";
    DictionaryMessage["DICT_EXISTS"] = "\u5B57\u5178\u5DF2\u5B58\u5728";
    // 更新相关
    DictionaryMessage["DICT_UPDATE_SUCCESS"] = "\u4FEE\u6539\u5B57\u5178\u6210\u529F";
    DictionaryMessage["DICT_UPDATE_ERROR"] = "\u4FEE\u6539\u5B57\u5178\u5931\u8D25";
    // 删除相关
    DictionaryMessage["DICT_DELETE_SUCCESS"] = "\u5220\u9664\u5B57\u5178\u6210\u529F";
    DictionaryMessage["DICT_DELETE_ERROR"] = "\u5220\u9664\u5B57\u5178\u5931\u8D25";
    DictionaryMessage["DICT_HAS_CHILDREN"] = "\u8BE5\u5B57\u5178\u4E0B\u6709\u5B50\u7EA7\u6570\u636E\uFF0C\u4E0D\u53EF\u5220\u9664";
    // 状态相关
    DictionaryMessage["DICT_STATUS_SUCCESS"] = "\u4FEE\u6539\u5B57\u5178\u72B6\u6001\u6210\u529F";
    DictionaryMessage["DICT_STATUS_ERROR"] = "\u4FEE\u6539\u5B57\u5178\u72B6\u6001\u5931\u8D25";
    // 参数相关
    DictionaryMessage["DICT_PARAMS_ERROR"] = "\u5B57\u5178\u53C2\u6570\u9519\u8BEF";
    DictionaryMessage["DICT_NAME_REQUIRED"] = "\u5B57\u5178\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A";
    DictionaryMessage["DICT_CODE_REQUIRED"] = "\u5B57\u5178\u7F16\u7801\u4E0D\u80FD\u4E3A\u7A7A";
    DictionaryMessage["DICT_VALUE_REQUIRED"] = "\u5B57\u5178\u503C\u4E0D\u80FD\u4E3A\u7A7A";
    // 父级字典相关
    DictionaryMessage["DICT_PARENT_NOT_FOUND"] = "\u7236\u7EA7\u5B57\u5178\u4E0D\u5B58\u5728";
    DictionaryMessage["DICT_PARENT_ERROR"] = "\u4E0D\u80FD\u5C06\u5B57\u5178\u8BBE\u7F6E\u4E3A\u81EA\u5DF1\u7684\u5B50\u5B57\u5178";
    // 其他
    DictionaryMessage["DICT_NOT_FOUND"] = "\u5B57\u5178\u4E0D\u5B58\u5728";
    DictionaryMessage["DICT_OPERATION_ERROR"] = "\u5B57\u5178\u64CD\u4F5C\u5931\u8D25";
    DictionaryMessage["DICT_CODE_EXISTS"] = "\u5B57\u5178\u7F16\u7801\u5DF2\u5B58\u5728";
    DictionaryMessage["DICT_GET_SUCCESS"] = "\u83B7\u53D6\u5B57\u5178\u6210\u529F";
})(DictionaryMessage || (exports.DictionaryMessage = DictionaryMessage = {}));

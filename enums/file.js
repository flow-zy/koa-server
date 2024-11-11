"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileMessage = void 0;
var FileMessage;
(function (FileMessage) {
    // 列表相关
    FileMessage["LIST_SUCCESS"] = "\u83B7\u53D6\u6587\u4EF6\u5217\u8868\u6210\u529F";
    FileMessage["LIST_ERROR"] = "\u83B7\u53D6\u6587\u4EF6\u5217\u8868\u5931\u8D25";
    // 上传相关
    FileMessage["UPLOAD_SUCCESS"] = "\u4E0A\u4F20\u6587\u4EF6\u6210\u529F";
    FileMessage["UPLOAD_ERROR"] = "\u4E0A\u4F20\u6587\u4EF6\u5931\u8D25";
    FileMessage["FILE_REQUIRED"] = "\u8BF7\u9009\u62E9\u8981\u4E0A\u4F20\u7684\u6587\u4EF6";
    // 删除相关
    FileMessage["DELETE_SUCCESS"] = "\u5220\u9664\u6587\u4EF6\u6210\u529F";
    FileMessage["DELETE_ERROR"] = "\u5220\u9664\u6587\u4EF6\u5931\u8D25";
    // 状态相关
    FileMessage["STATUS_SUCCESS"] = "\u66F4\u65B0\u6587\u4EF6\u72B6\u6001\u6210\u529F";
    FileMessage["STATUS_ERROR"] = "\u66F4\u65B0\u6587\u4EF6\u72B6\u6001\u5931\u8D25";
    // 其他
    FileMessage["NOT_FOUND"] = "\u6587\u4EF6\u4E0D\u5B58\u5728";
    FileMessage["DETAIL_ERROR"] = "\u83B7\u53D6\u6587\u4EF6\u8BE6\u60C5\u5931\u8D25";
})(FileMessage || (exports.FileMessage = FileMessage = {}));

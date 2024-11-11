"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeMessage = void 0;
var NoticeMessage;
(function (NoticeMessage) {
    // 列表相关
    NoticeMessage["LIST_SUCCESS"] = "\u83B7\u53D6\u901A\u77E5\u516C\u544A\u5217\u8868\u6210\u529F";
    NoticeMessage["LIST_ERROR"] = "\u83B7\u53D6\u901A\u77E5\u516C\u544A\u5217\u8868\u5931\u8D25";
    // 创建相关
    NoticeMessage["CREATE_SUCCESS"] = "\u521B\u5EFA\u901A\u77E5\u516C\u544A\u6210\u529F";
    NoticeMessage["CREATE_ERROR"] = "\u521B\u5EFA\u901A\u77E5\u516C\u544A\u5931\u8D25";
    NoticeMessage["TITLE_REQUIRED"] = "\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A";
    NoticeMessage["CONTENT_REQUIRED"] = "\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A";
    // 更新相关
    NoticeMessage["UPDATE_SUCCESS"] = "\u66F4\u65B0\u901A\u77E5\u516C\u544A\u6210\u529F";
    NoticeMessage["UPDATE_ERROR"] = "\u66F4\u65B0\u901A\u77E5\u516C\u544A\u5931\u8D25";
    NoticeMessage["CANNOT_UPDATE_PUBLISHED"] = "\u5DF2\u53D1\u5E03\u7684\u901A\u77E5\u516C\u544A\u4E0D\u80FD\u4FEE\u6539";
    // 删除相关
    NoticeMessage["DELETE_SUCCESS"] = "\u5220\u9664\u901A\u77E5\u516C\u544A\u6210\u529F";
    NoticeMessage["DELETE_ERROR"] = "\u5220\u9664\u901A\u77E5\u516C\u544A\u5931\u8D25";
    NoticeMessage["CANNOT_DELETE_PUBLISHED"] = "\u5DF2\u53D1\u5E03\u7684\u901A\u77E5\u516C\u544A\u4E0D\u80FD\u5220\u9664";
    // 发布相关
    NoticeMessage["PUBLISH_SUCCESS"] = "\u53D1\u5E03\u901A\u77E5\u516C\u544A\u6210\u529F";
    NoticeMessage["PUBLISH_ERROR"] = "\u53D1\u5E03\u901A\u77E5\u516C\u544A\u5931\u8D25";
    NoticeMessage["ALREADY_PUBLISHED"] = "\u901A\u77E5\u516C\u544A\u5DF2\u53D1\u5E03";
    // 撤回相关
    NoticeMessage["REVOKE_SUCCESS"] = "\u64A4\u56DE\u901A\u77E5\u516C\u544A\u6210\u529F";
    NoticeMessage["REVOKE_ERROR"] = "\u64A4\u56DE\u901A\u77E5\u516C\u544A\u5931\u8D25";
    NoticeMessage["NOT_PUBLISHED"] = "\u901A\u77E5\u516C\u544A\u672A\u53D1\u5E03";
    // 置顶相关
    NoticeMessage["TOP_SUCCESS"] = "\u64CD\u4F5C\u6210\u529F";
    NoticeMessage["TOP_ERROR"] = "\u64CD\u4F5C\u5931\u8D25";
    // 其他
    NoticeMessage["NOT_FOUND"] = "\u901A\u77E5\u516C\u544A\u4E0D\u5B58\u5728";
    NoticeMessage["DETAIL_ERROR"] = "\u83B7\u53D6\u901A\u77E5\u516C\u544A\u8BE6\u60C5\u5931\u8D25";
})(NoticeMessage || (exports.NoticeMessage = NoticeMessage = {}));

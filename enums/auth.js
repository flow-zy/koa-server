"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMessage = void 0;
var AuthMessage;
(function (AuthMessage) {
    AuthMessage["TOKEN_REQUIRED"] = "\u8BF7\u5148\u767B\u5F55";
    AuthMessage["TOKEN_INVALID"] = "\u65E0\u6548\u7684\u8BBF\u95EE\u4EE4\u724C";
    AuthMessage["TOKEN_EXPIRED"] = "\u8BBF\u95EE\u4EE4\u724C\u5DF2\u8FC7\u671F";
    AuthMessage["TOKEN_REVOKED"] = "\u8BBF\u95EE\u4EE4\u724C\u5DF2\u88AB\u6CE8\u9500";
    AuthMessage["IP_MISMATCH"] = "IP\u5730\u5740\u4E0D\u5339\u914D";
    AuthMessage["AUTH_FAILED"] = "\u8BA4\u8BC1\u5931\u8D25";
    AuthMessage["ACCOUNT_LOGGED_ELSEWHERE"] = "\u8D26\u53F7\u5DF2\u5728\u5176\u4ED6\u5730\u65B9\u767B\u5F55";
    AuthMessage["LOGIN_SUCCESS"] = "\u767B\u5F55\u6210\u529F";
    AuthMessage["LOGIN_FAILED"] = "\u767B\u5F55\u5931\u8D25";
    AuthMessage["LOGOUT_SUCCESS"] = "\u767B\u51FA\u6210\u529F";
    AuthMessage["REFRESH_TOKEN_INVALID"] = "\u65E0\u6548\u7684\u5237\u65B0\u4EE4\u724C";
    AuthMessage["REFRESH_TOKEN_EXPIRED"] = "\u5237\u65B0\u4EE4\u724C\u5DF2\u8FC7\u671F";
    AuthMessage["USERNAME_REQUIRED"] = "\u7528\u6237\u540D\u4E0D\u80FD\u4E3A\u7A7A";
    AuthMessage["PASSWORD_REQUIRED"] = "\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A";
    AuthMessage["CONFIRM_PASSWORD_REQUIRED"] = "\u786E\u8BA4\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A";
    AuthMessage["PASSWORD_NOT_MATCH"] = "\u4E24\u6B21\u8F93\u5165\u7684\u5BC6\u7801\u4E0D\u4E00\u81F4";
    AuthMessage["USER_NOT_FOUND"] = "\u7528\u6237\u4E0D\u5B58\u5728";
    AuthMessage["USER_EXISTS"] = "\u7528\u6237\u5DF2\u5B58\u5728";
    AuthMessage["PASSWORD_ERROR"] = "\u5BC6\u7801\u9519\u8BEF";
    AuthMessage["REGISTER_SUCCESS"] = "\u6CE8\u518C\u6210\u529F";
    AuthMessage["USERNAME_FORMAT_ERROR"] = "\u7528\u6237\u540D\u683C\u5F0F\u9519\u8BEF";
    AuthMessage["PASSWORD_FORMAT_ERROR"] = "\u5BC6\u7801\u683C\u5F0F\u9519\u8BEF";
    AuthMessage["EMAIL_FORMAT_ERROR"] = "\u90AE\u7BB1\u683C\u5F0F\u9519\u8BEF";
    AuthMessage["PHONE_FORMAT_ERROR"] = "\u624B\u673A\u53F7\u683C\u5F0F\u9519\u8BEF";
})(AuthMessage || (exports.AuthMessage = AuthMessage = {}));
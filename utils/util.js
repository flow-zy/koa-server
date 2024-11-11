"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLimitAndOffset = getLimitAndOffset;
exports.emptyObject = emptyObject;
// 通过传过来的pageSize和pageNum计算出limit和offset
function getLimitAndOffset(pageSize, pageNum) {
    const limit = pageSize * 1 || 10;
    const offset = pageNum ? (pageNum - 1) * limit : 0;
    return { limit, offset };
}
// 判断对象中是否有值为空
function emptyObject(obj) {
    if (!(obj instanceof Object))
        return false;
    return Object.keys(obj).length > 0;
}

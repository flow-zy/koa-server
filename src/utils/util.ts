// 通过传过来的pageSize和pageNum计算出limit和offset
export function getLimitAndOffset(pageSize: number, pageNum: number) {
  const limit = pageSize*1 || 10
  const offset = pageNum ? (pageNum - 1) * limit : 0
  return { limit, offset }
}
// 判断对象中是否有值为空
export function emptyObject(obj: any) {
  if (!(obj instanceof Object))
    return false
  return Object.keys(obj).length > 0
}

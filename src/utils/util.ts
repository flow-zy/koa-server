export function paginate(
  data: any = [],
  currentPage: number = 1,
  pageSize: number = 10,
  total: number = 0,
) {
  return {
    data,
    currentPage,
    pageSize,
    total,
    totalPage: Math.ceil(total / pageSize),
  };
}

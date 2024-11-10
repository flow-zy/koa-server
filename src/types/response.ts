// 状态码枚举
export enum StatusCode {
	SUCCESS = 200, // 成功
	ERROR = 201, // 一般错误
	PARAMS_ERROR = 202, // 参数错误
	AUTH_ERROR = 401, // 认证错误
	FORBIDDEN = 403, // 禁止访问
	NOT_FOUND = 404, // 资源不存在
	INTERNAL_ERROR = 500, // 服务器内部错误
	UNAUTHORIZED = 401 // 未授权
}

// 基础响应接口
export interface BaseResponse {
	code: StatusCode | number
	message: string
	timestamp?: number
	requestId?: string
}

// 带数据的响应接口
export interface Response<T = any> extends BaseResponse {
	data?: T
}

// 分页参数接口
export interface PaginationParams {
	pagesize: number
	pagenumber: number
}

// 分页响应数据接口
export interface PaginationData<T> {
	list: T[]
	total: number
	pagesize: number
	pagenumber: number
}

// 分页响应接口
export interface PaginationResponse<T> extends Response {
	data: PaginationData<T>
}

// 列表响应接口
export interface ListResponse<T> extends Response {
	data: T[]
}

// 树形数据节点接口
export interface TreeNode {
	id: number
	parent_id: number | null
	children?: TreeNode[]
}

// 查询参数类型
export type ParamsType<T> = Partial<T> &
	PaginationParams & {
		startTime?: string
		endTime?: string
		[key: string]: any
	}

// 响应处理器类型
export type ResponseHandler = <T>(
	message: string,
	code?: StatusCode | number,
	data?: T
) => Response<T>

// 错误响应接口
export interface ErrorResponse extends BaseResponse {
	error?: string
	path?: string
	timestamp: number
}

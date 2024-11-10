import {
	AppError,
	BusinessError,
	ParamError,
	AuthError,
	ForbiddenError
} from '../middleware/errHandler'

export class ErrorUtil {
	// 抛出业务错误
	static throw(message: string, code?: number, data?: any): never {
		throw new BusinessError(message, code, data)
	}

	// 抛出参数错误
	static throwParam(message?: string, data?: any): never {
		throw new ParamError(message, data)
	}

	// 抛出认证错误
	static throwAuth(message?: string, data?: any): never {
		throw new AuthError(message, data)
	}

	// 抛出权限错误
	static throwForbidden(message?: string, data?: any): never {
		throw new ForbiddenError(message, data)
	}

	// 断言
	static assert(condition: boolean, message: string, code?: number): void {
		if (!condition) {
			this.throw(message, code)
		}
	}

	// 参数断言
	static assertParam(condition: boolean, message?: string): void {
		if (!condition) {
			this.throwParam(message)
		}
	}
}

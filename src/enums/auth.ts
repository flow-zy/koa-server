export enum AuthMessage {
	TOKEN_REQUIRED = '请先登录',
	TOKEN_INVALID = '无效的访问令牌',
	TOKEN_EXPIRED = '访问令牌已过期',
	TOKEN_REVOKED = '访问令牌已被注销',
	IP_MISMATCH = 'IP地址不匹配',
	AUTH_FAILED = '认证失败',
	ACCOUNT_LOGGED_ELSEWHERE = '账号已在其他地方登录',
	LOGIN_SUCCESS = '登录成功',
	LOGIN_FAILED = '登录失败',
	LOGOUT_SUCCESS = '登出成功',
	REFRESH_TOKEN_INVALID = '无效的刷新令牌',
	REFRESH_TOKEN_EXPIRED = '刷新令牌已过期',
	USERNAME_REQUIRED = '用户名不能为空',
	PASSWORD_REQUIRED = '密码不能为空',
	CONFIRM_PASSWORD_REQUIRED = '确认密码不能为空',
	PASSWORD_NOT_MATCH = '两次输入的密码不一致',
	USER_NOT_FOUND = '用户不存在',
	USER_EXISTS = '用户已存在',
	PASSWORD_ERROR = '密码错误',
	REGISTER_SUCCESS = '注册成功',
	USERNAME_FORMAT_ERROR = '用户名格式错误',
	PASSWORD_FORMAT_ERROR = '密码格式错误',
	EMAIL_FORMAT_ERROR = '邮箱格式错误',
	PHONE_FORMAT_ERROR = '手机号格式错误'
}

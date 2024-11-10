// 用户相关路由返回消息枚举
export enum UserMessage {
	USER_NOT_EXIST = '账号不存在',
	USER_EXIST = '账号已存在',
	USER_OR_PASSWORD_ERROR = '账号或者密码错误',
	USER_NOT_EXIST_ERROR = '账号不存在',
	USER_SUCCESS = '登录成功',
	USER_REGISTER_SUCCESS = '注册成功',
	USER_REGISTER_ERROR = '注册失败',
	USER_STATUS_SUCCESS = '用户状态更新成功',
	USER_LIST_SUCCESS = '用户列表获取成功',
	USER_LIST_ERROR = '用户列表获取失败',
	USER_UPD_INFO = '修改用户信息成功',
	USER_UPD_INFO_ERROR = '修改用户信息失败',
	USER_BATCH_USER_SUCCESS = '批量删除用户成功',
	USER_BATCH_USER_ERROR = '批量删除用户失败',
	USER_DEL_SUCCESS = '删除用户成功',
	USER_DEL_ERROR = '删除用户失败',
	USER_ROLE_SUCCESS = '用户角色设置成功',
	USER_ROLE_ERROR = '用户角色设置失败',
	USER_PASSWORD_SUCCESS = '密码修改成功',
	USER_PASSWORD_ERROR = '密码修改失败',
	USER_AVATAR_ERROR = '头像修改失败',
	USER_AVATAR_SUCCESS = '头像修改成功',
	USER_UPD_INFO_SUCCESS = '修改用户信息成功',
	USER_INFO_SUCCESS = '获取用户信息成功',
	USER_INFO_ERROR = '获取用户信息失败',
	// 成功消息
	USER_ADD_SUCCESS = '用户添加成功',
	USER_UPDATE_SUCCESS = '用户更新成功',
	USER_DELETE_SUCCESS = '用户删除成功',

	// 错误消息
	USER_ADD_ERROR = '用户添加失败',
	USERNAME_REQUIRED = '用户名不能为空',
	PASSWORD_REQUIRED = '密码不能为空',
	USERNAME_FORMAT_ERROR = '用户名格式错误（4-20位字母、数字或下划线）',
	INVALID_PARAMS = '无效的参数',
	SYSTEM_ERROR = '系统错误，请联系管理员',

	// 状态相关
	USER_STATUS_ERROR = '用户状态异常',
	USER_DISABLED = '用户已禁用',

	// 权限相关
	ROLE_REQUIRED = '用户角色不能为空',
	PERMISSION_DENIED = '权限不足',
	SUPER_EXIT = '超级管理员已存在'
}

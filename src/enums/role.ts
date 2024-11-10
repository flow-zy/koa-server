export enum RoleMessage {
	// 列表相关
	ROLE_LIST_SUCCESS = '获取角色列表成功',
	ROLE_LIST_ERROR = '获取角色列表失败',

	// 添加相关
	ROLE_ADD_SUCCESS = '添加角色成功',
	ROLE_ADD_ERROR = '添加角色失败',
	ROLE_EXISTS = '角色已存在',

	// 更新相关
	ROLE_UPDATE_SUCCESS = '修改角色成功',
	ROLE_UPDATE_ERROR = '修改角色失败',

	// 删除相关
	ROLE_DELETE_SUCCESS = '删除角色成功',
	ROLE_DELETE_ERROR = '删除角色失败',

	// 状态相关
	ROLE_STATUS_SUCCESS = '修改角色状态成功',
	ROLE_STATUS_ERROR = '修改角色状态失败',

	// 参数相关
	ROLE_PARAMS_ERROR = '角色参数错误',
	ROLE_NAME_REQUIRED = '角色名称不能为空',

	// 权限相关
	ROLE_PERMISSION_ERROR = '角色权限设置失败',
	ROLE_PERMISSION_SUCCESS = '角色权限设置成功',

	// 其他
	ROLE_NOT_FOUND = '角色不存在',
	ROLE_OPERATION_ERROR = '角色操作失败',
	// 错误消息
	ROLE_ID_REQUIRED = '角色ID不能为空',
	ROLE_NOT_EXIST = '角色不存在',
	ROLE_CODE_REQUIRED = '角色编码不能为空',
	ROLE_EXIST = '角色已存在',
	// 系统错误
	SYSTEM_ERROR = '系统错误，请联系管理员',
	// 获取角色详情
	GET_ROLE_DETAIL_SUCCESS = '获取角色详情成功',
	GET_ROLE_DETAIL_ERROR = '获取角色详情失败'
}

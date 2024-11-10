export enum MenuMessage {
	// 列表相关
	MENU_LIST_SUCCESS = '获取菜单列表成功',
	MENU_LIST_ERROR = '获取菜单列表失败',

	// 添加相关
	MENU_ADD_SUCCESS = '添加菜单成功',
	MENU_ADD_ERROR = '添加菜单失败',
	MENU_EXISTS = '菜单已存在',

	// 更新相关
	MENU_UPDATE_SUCCESS = '修改菜单成功',
	MENU_UPDATE_ERROR = '修改菜单失败',

	// 删除相关
	MENU_DELETE_SUCCESS = '删除菜单成功',
	MENU_DELETE_ERROR = '删除菜单失败',

	// 状态相关
	MENU_STATUS_SUCCESS = '修改菜单状态成功',
	MENU_STATUS_ERROR = '修改菜单状态失败',

	// 参数相关
	MENU_PARAMS_ERROR = '菜单参数错误',
	MENU_NAME_REQUIRED = '菜单名称不能为空',
	MENU_PATH_REQUIRED = '菜单路径不能为空',

	// 父级菜单相关
	MENU_PARENT_NOT_FOUND = '父级菜单不存在',
	MENU_PARENT_ERROR = '不能将菜单设置为自己的子菜单',

	// 其他
	MENU_NOT_FOUND = '菜单不存在',
	MENU_OPERATION_ERROR = '菜单操作失败',
	MENU_HAS_CHILDREN = '该菜单下存在子菜单，无法操作'
}

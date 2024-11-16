export enum DictionaryMessage {
	// 列表相关
	DICT_LIST_SUCCESS = '获取字典列表成功',
	DICT_LIST_ERROR = '获取字典列表失败',

	// 添加相关
	DICT_ADD_SUCCESS = '添加字典成功',
	DICT_ADD_ERROR = '添加字典失败',
	DICT_EXISTS = '字典已存在',

	// 更新相关
	DICT_UPDATE_SUCCESS = '修改字典成功',
	DICT_UPDATE_ERROR = '修改字典失败',

	// 删除相关
	DICT_DELETE_SUCCESS = '删除字典成功',
	DICT_DELETE_ERROR = '删除字典失败',
	DICT_HAS_CHILDREN = '该字典下有子级数据，不可删除',

	// 状态相关
	DICT_STATUS_SUCCESS = '修改字典状态成功',
	DICT_STATUS_ERROR = '修改字典状态失败',

	// 参数相关
	DICT_PARAMS_ERROR = '字典参数错误',
	DICT_NAME_REQUIRED = '字典名称不能为空',
	DICT_CODE_REQUIRED = '字典编码不能为空',
	DICT_VALUE_REQUIRED = '字典值不能为空',

	// 父级字典相关
	DICT_PARENT_NOT_FOUND = '父级字典不存在',
	DICT_PARENT_ERROR = '不能将字典设置为自己的子字典',

	// 其他
	DICT_NOT_FOUND = '字典不存在',
	DICT_OPERATION_ERROR = '字典操作失败',
	DICT_CODE_EXISTS = '字典编码已存在',
	DICT_GET_SUCCESS = '获取字典成功',
	DICT_ALL_ERROR = '获取所有字典失败'
}

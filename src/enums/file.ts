export enum FileMessage {
	// 列表相关
	LIST_SUCCESS = '获取文件列表成功',
	LIST_ERROR = '获取文件列表失败',

	// 上传相关
	UPLOAD_SUCCESS = '上传文件成功',
	UPLOAD_ERROR = '上传文件失败',
	FILE_REQUIRED = '请选择要上传的文件',

	// 删除相关
	DELETE_SUCCESS = '删除文件成功',
	DELETE_ERROR = '删除文件失败',

	// 状态相关
	STATUS_SUCCESS = '更新文件状态成功',
	STATUS_ERROR = '更新文件状态失败',

	// 其他
	NOT_FOUND = '文件不存在',
	DETAIL_ERROR = '获取文件详情失败'
}

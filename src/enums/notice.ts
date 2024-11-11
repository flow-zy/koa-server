export enum NoticeMessage {
	// 列表相关
	LIST_SUCCESS = '获取通知公告列表成功',
	LIST_ERROR = '获取通知公告列表失败',

	// 创建相关
	CREATE_SUCCESS = '创建通知公告成功',
	CREATE_ERROR = '创建通知公告失败',
	TITLE_REQUIRED = '标题不能为空',
	CONTENT_REQUIRED = '内容不能为空',

	// 更新相关
	UPDATE_SUCCESS = '更新通知公告成功',
	UPDATE_ERROR = '更新通知公告失败',
	CANNOT_UPDATE_PUBLISHED = '已发布的通知公告不能修改',

	// 删除相关
	DELETE_SUCCESS = '删除通知公告成功',
	DELETE_ERROR = '删除通知公告失败',
	CANNOT_DELETE_PUBLISHED = '已发布的通知公告不能删除',

	// 发布相关
	PUBLISH_SUCCESS = '发布通知公告成功',
	PUBLISH_ERROR = '发布通知公告失败',
	ALREADY_PUBLISHED = '通知公告已发布',

	// 撤回相关
	REVOKE_SUCCESS = '撤回通知公告成功',
	REVOKE_ERROR = '撤回通知公告失败',
	NOT_PUBLISHED = '通知公告未发布',

	// 置顶相关
	TOP_SUCCESS = '操作成功',
	TOP_ERROR = '操作失败',

	// 其他
	NOT_FOUND = '通知公告不存在',
	DETAIL_ERROR = '获取通知公告详情失败'
}

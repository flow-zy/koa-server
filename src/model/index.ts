// 导入所有模型
import DepartmentModel from './departmentModel'
import DictionaryModel from './dictionaryModel'
import FileModel from './fileModel'
import LogModel from './log'
import MenuModel from './menuModel'
import MonitorModel from './monitorModel'
import NoticeModel from './noticeModel'
import PermissionModel from './permissionModel'
import RoleMenuModel from './roleMenuModel'
import RoleModel from './roleModel'
import RolePermissionModel from './rolePermissionModel'
import RoleUserModel from './roleUserModel'
import UserDepartModel from './userDepartModel'
import UserModel from './userModel'
import NotificationModel from './notificationModel'
export default [
	UserModel,
	DepartmentModel,
	RoleModel,
	UserDepartModel,
	RoleUserModel,
	PermissionModel,
	MenuModel,
	RolePermissionModel,
	RoleMenuModel,
	DictionaryModel,
	FileModel,
	LogModel,
	MonitorModel,
	NoticeModel,
	NotificationModel
]

export { UserModel, DepartmentModel, RoleModel, UserDepartModel }

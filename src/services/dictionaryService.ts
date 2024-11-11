import { BaseDao, QueryParams } from '../dao/baseDao'
import DictionaryModel from '../model/dictionaryModel'
import { Op } from 'sequelize'
import { BusinessError } from '../utils/businessError'
import { DateUtil } from '../utils/dateUtil'
import { DictionaryMessage } from '../enums/dictionary'

export class DictionaryService {
	/**
	 * 获取字典列表
	 */
	async getList(
		params: QueryParams & {
			keyword?: string
			status?: number
			startTime?: string
			endTime?: string
		}
	) {
		const { keyword, status, startTime, endTime, ...restParams } = params

		const queryParams: QueryParams = {
			...restParams,
			where: {
				...(keyword && {
					[Op.or]: [
						{ dictname: { [Op.like]: `%${keyword}%` } },
						{ dictcode: { [Op.like]: `%${keyword}%` } }
					]
				}),
				...(status !== undefined && { status }),
				...(startTime &&
					endTime && {
						created_at: {
							[Op.between]: [
								DateUtil.formatDate(new Date(startTime)),
								DateUtil.formatDate(new Date(endTime))
							]
						}
					})
			},
			order: [
				['sort', 'ASC'],
				['created_at', 'DESC']
			]
		}

		const result = await BaseDao.findByPage(DictionaryModel, queryParams)

		// 将列表数据转换为树形结构
		const treeData = this.buildDictionaryTree(result.list)

		return {
			...result,
			list: treeData
		}
	}

	/**
	 * 获取所有字典
	 */
	async getAll(params: QueryParams = {}) {
		const result = await BaseDao.findAll(DictionaryModel, {
			...params,
			order: [['sort', 'ASC']]
		})

		// 将列表数据转换为树形结构
		const treeData = this.buildDictionaryTree(result.list)

		return {
			...result,
			list: treeData
		}
	}

	/**
	 * 构建字典树
	 */
	private buildDictionaryTree(
		dictList: any[],
		parentId: number | null = null
	): any[] {
		return dictList
			.filter((dict) => dict.parentid === parentId)
			.map((dict) => ({
				...dict,
				children: this.buildDictionaryTree(dictList, dict.id)
			}))
			.sort((a, b) => a.sort - b.sort)
	}

	/**
	 * 创建字典
	 */
	async create(data: Partial<DictionaryModel>) {
		// 检查编码是否存在
		const exists = await BaseDao.findOne(DictionaryModel, {
			where: { dictcode: data.dictcode }
		})

		if (exists) {
			throw new BusinessError(DictionaryMessage.DICT_CODE_EXISTS)
		}

		// 如果有父级ID，检查父级是否存在
		if (data.parentid) {
			const parent = await BaseDao.findById(
				DictionaryModel,
				data.parentid
			)
			if (!parent) {
				throw new BusinessError(DictionaryMessage.DICT_PARENT_NOT_FOUND)
			}
		}

		return await BaseDao.create(DictionaryModel, {
			...data,
			status: data.status ?? 1,
			sort: data.sort ?? 1,
			parentid: data.parentid ?? undefined
		})
	}

	/**
	 * 更新字典
	 */
	async update(id: number, data: Partial<DictionaryModel>) {
		// 检查编码是否与其他记录冲突
		if (data.dictcode) {
			const exists = await BaseDao.findOne(DictionaryModel, {
				where: {
					dictcode: data.dictcode,
					id: { [Op.ne]: id }
				}
			})

			if (exists) {
				throw new BusinessError(DictionaryMessage.DICT_CODE_EXISTS)
			}
		}

		// 如果更新父级ID，检查父级是否存在且不能设置为自己或自己的子级
		if (data.parentid) {
			if (data.parentid === id) {
				throw new BusinessError(DictionaryMessage.DICT_PARENT_ERROR)
			}

			const parent = await BaseDao.findById(
				DictionaryModel,
				data.parentid
			)
			if (!parent) {
				throw new BusinessError(DictionaryMessage.DICT_PARENT_NOT_FOUND)
			}

			// 检查是否设置为自己的子级
			const children = await this.getChildrenIds(id)
			if (children.includes(data.parentid)) {
				throw new BusinessError(DictionaryMessage.DICT_PARENT_ERROR)
			}
		}

		return await BaseDao.update(DictionaryModel, data, { id })
	}

	/**
	 * 获取所有子级ID
	 */
	private async getChildrenIds(id: number): Promise<number[]> {
		const allDict = await BaseDao.findAll(DictionaryModel, {})
		const result: number[] = []

		const findChildren = (parentId: number) => {
			const children = allDict.list.filter(
				(dict: Partial<DictionaryModel>) => dict.parentid === parentId
			)
			children.forEach((child: Partial<DictionaryModel>) => {
				result.push(child.id!)
				findChildren(child.id!)
			})
		}

		findChildren(id)
		return result
	}

	/**
	 * 删除字典
	 */
	async delete(id: number) {
		// 检查是否存在子级
		const children = await BaseDao.findOne(DictionaryModel, {
			where: { parentid: id }
		})

		if (children) {
			throw new BusinessError(DictionaryMessage.DICT_HAS_CHILDREN)
		}

		return await BaseDao.delete(DictionaryModel, { id })
	}

	/**
	 * 获取字典详情
	 */
	async getDetail(id: number) {
		return await BaseDao.findById(DictionaryModel, id)
	}

	/**
	 * 更新字典状态
	 */
	async updateStatus(id: number) {
		const dict = await BaseDao.findById(DictionaryModel, id)
		if (!dict) {
			throw new BusinessError(DictionaryMessage.DICT_NOT_FOUND)
		}

		const status = dict.status === 1 ? 0 : 1
		return await BaseDao.update(DictionaryModel, { status }, { id })
	}

	/**
	 * 根据编码获取字典
	 */
	async getByCode(code: string) {
		return await BaseDao.findOne(DictionaryModel, {
			where: { dictcode: code, status: 1 },
			order: [['sort', 'ASC']]
		})
	}
}

export const dictionaryService = new DictionaryService()

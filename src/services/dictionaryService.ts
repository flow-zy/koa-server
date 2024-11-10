import { Op } from 'sequelize'
import DictionaryModel from '../model/dictionaryModel'
import { ParamsType } from '../types'
import { getLimitAndOffset } from '../utils/util'
import { DateUtil } from '../utils/dateUtil'

interface DictTree extends DictionaryModel {
	children?: DictTree[]
}

class DictionaryService {
	private buildDictTree = (
		dicts: DictionaryModel[],
		parentId: number | null = null
	): DictTree[] => {
		const tree: DictTree[] = []

		dicts.forEach((dict) => {
			if (dict.parentid === parentId) {
				const node: DictTree = dict.toJSON()
				const children = this.buildDictTree(dicts, dict.id)
				// @ts-ignore
				node.created_at = DateUtil.formatDateTime(node.created_at)
				if (children.length) {
					node.children = children
				}
				tree.push(node)
			}
		})

		return tree
	}

	getDictList = async (params: ParamsType<DictionaryModel>) => {
		const { pagesize, pagenumber, startTime, endTime, ..._params } = params

		const { limit, offset } = getLimitAndOffset(pagesize, pagenumber)
		const options: any = { limit, offset }

		const where: any = { ..._params, status: 1 }
		// 添加时间范围过滤
		if (startTime && endTime) {
			where.created_at = {
				[Op.between]: [new Date(startTime), new Date(endTime)]
			}
		} else if (startTime) {
			where.created_at = {
				[Op.gte]: new Date(startTime)
			}
		} else if (endTime) {
			where.created_at = {
				[Op.lte]: new Date(endTime)
			}
		}

		if (Object.keys(_params).length > 0) options.where = where

		const { count, rows } = await DictionaryModel.findAndCountAll({
			...options,
			order: [['sort', 'DESC']],
			attributes: {
				exclude: ['deleted_at', 'updated_at']
			}
		})

		const dictTree = this.buildDictTree(rows)

		return {
			total: count,
			pagesize: pagesize,
			pagenumber: pagenumber,
			list: dictTree
		}
	}

	getAllDict = async () => {
		const dicts = await DictionaryModel.findAll({
			order: [['sort', 'DESC']],
			where: { status: 1 },
			attributes: {
				exclude: ['deleted_at', 'updated_at']
			}
		})

		return this.buildDictTree(dicts)
	}

	addDict = async (params: Partial<DictionaryModel>) => {
		// 检查父级是否存在
		if (params.parentid) {
			const parentDict = await DictionaryModel.findOne({
				where: {
					id: params.parentid,
					status: 1
				}
			})
			if (!parentDict) return false
		}

		// 检查同级字典编码是否重复
		const existDict = await DictionaryModel.findOne({
			where: {
				dictcode: params.dictcode,
				parentid: params.parentid || null,
				status: 1
			}
		})
		if (existDict) return false

		const result = await DictionaryModel.create(params)
		return result ? true : false
	}

	updateDict = async (id: number, params: Partial<DictionaryModel>) => {
		// 检查是否修改了父级ID
		if (params.parentid !== undefined) {
			// 不能将字典设置为自己的子字典
			if (params.parentid === id) return false

			// 检查新的父级是否存在
			if (params.parentid) {
				const parentDict = await DictionaryModel.findOne({
					where: {
						id: params.parentid,
						status: 1
					}
				})
				if (!parentDict) return false
			}
		}

		// 检查同级字典编码是否重复
		if (params.dictcode) {
			const existDict = await DictionaryModel.findOne({
				where: {
					dictcode: params.dictcode,
					parentid: params.parentid || null,
					id: { [Op.ne]: id },
					status: 1
				}
			})
			if (existDict) return false
		}

		const result = await DictionaryModel.update(params, { where: { id } })
		return result[0] > 0
	}

	deleteDict = async (id: number) => {
		// 检查是否有子字典
		const hasChildren = await DictionaryModel.findOne({
			where: {
				parentid: id,
				status: 1
			}
		})
		if (hasChildren) return false

		const result = await DictionaryModel.destroy({ where: { id } })
		return result
	}

	changeStatus = async (id: number) => {
		const dict = await DictionaryModel.findByPk(id)
		if (!dict) return false

		const newStatus = dict.status === 1 ? 0 : 1

		const result = await DictionaryModel.update(
			{ status: newStatus },
			{ where: { id } }
		)
		return result[0] > 0
	}
	// 判断有没有子级
	hasChildren = async (id: number) => {
		const hasChildren = await DictionaryModel.findOne({
			where: { parentid: id, status: 1 }
		})
		return hasChildren
	}
}

export default new DictionaryService()

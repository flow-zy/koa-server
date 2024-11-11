import {
	Model,
	ModelStatic,
	WhereOptions,
	FindOptions,
	CreateOptions,
	UpdateOptions,
	DestroyOptions,
	Transaction,
	Includeable,
	Order
} from 'sequelize'
import { DataUtil } from '../utils/dataUtil'

export interface QueryParams {
	pagenumber?: number
	pagesize?: number
	order?: Order
	attributes?: string[]
	include?: Includeable | Includeable[]
	where?: WhereOptions
	[key: string]: any
}

export class BaseDao {
	/**
	 * 构建查询条件
	 */
	protected static buildWhere(
		params: Record<string, any> = {}
	): WhereOptions {
		const where: WhereOptions = {}

		// 过滤掉不需要的字段
		const excludeFields = [
			'pagenumber',
			'pagesize',
			'order',
			'attributes',
			'include'
		]

		Object.entries(params).forEach(([key, value]) => {
			if (
				!excludeFields.includes(key) &&
				value !== undefined &&
				value !== null &&
				value !== ''
			) {
				where[key] = value
			}
		})

		return where
	}

	/**
	 * 构建查询选项
	 */
	protected static buildOptions(params: QueryParams = {}): FindOptions {
		const {
			pagenumber = 1,
			pagesize = 10,
			order = [['created_at', 'DESC']],
			attributes,
			include,
			where,
			...rest
		} = params

		const options: FindOptions = {
			where: this.buildWhere({ ...where, ...rest }),
			order,
			...(attributes && { attributes }),
			...(include && { include })
		}

		// 如果有分页参数，添加分页
		if (pagenumber && pagesize) {
			options.offset = (pagenumber - 1) * pagesize
			options.limit = pagesize
		}

		return options
	}

	/**
	 * 分页查询
	 */
	static async findByPage<T extends Model>(
		model: ModelStatic<T>,
		params: QueryParams,
		transaction?: Transaction
	) {
		const options = this.buildOptions(params)
		if (transaction) {
			options.transaction = transaction
		}

		const { count, rows } = await model.findAndCountAll(options)

		return {
			list: DataUtil.toJSON(rows),
			total: count,
			pagenumber: params.pagenumber || 1,
			pagesize: params.pagesize || 10
		}
	}

	/**
	 * 查找所有记录（带分页）
	 */
	static async findAll<T extends Model>(
		model: ModelStatic<T>,
		params: QueryParams,
		transaction?: Transaction
	) {
		const {
			pagenumber = 1,
			pagesize = 999999, // 默认一个较大的数，实际上是查询所有
			...restParams
		} = params

		const options = this.buildOptions({
			...restParams,
			pagenumber,
			pagesize
		})

		if (transaction) {
			options.transaction = transaction
		}

		const { count, rows } = await model.findAndCountAll(options)

		return {
			list: DataUtil.toJSON(rows),
			total: count,
			pagenumber,
			pagesize
		}
	}

	/**
	 * 查找单条记录
	 */
	static async findOne<T extends Model>(
		model: ModelStatic<T>,
		params: Omit<QueryParams, 'pagenumber' | 'pagesize'>,
		transaction?: Transaction
	) {
		const options = this.buildOptions(params)
		if (transaction) {
			options.transaction = transaction
		}

		const result = await model.findOne(options)
		return result ? DataUtil.toJSON(result) : null
	}

	/**
	 * 创建记录
	 */
	static async create<T extends Model>(
		model: ModelStatic<T>,
		data: Partial<T>,
		transaction?: Transaction
	) {
		const options: CreateOptions = {}
		if (transaction) {
			options.transaction = transaction
		}

		const result = await model.create(data as any, options)
		return DataUtil.toJSON(result)
	}

	/**
	 * 批量创建记录
	 */
	static async bulkCreate<T extends Model>(
		model: ModelStatic<T>,
		dataList: Partial<T>[],
		transaction?: Transaction
	) {
		const options: CreateOptions = {}
		if (transaction) {
			options.transaction = transaction
		}

		const results = await model.bulkCreate(dataList as any[], options)
		return DataUtil.toJSON(results)
	}

	/**
	 * 更新记录
	 */
	static async update<T extends Model>(
		model: ModelStatic<T>,
		data: Partial<T>,
		where: WhereOptions,
		transaction?: Transaction
	) {
		const options: UpdateOptions = { where }
		if (transaction) {
			options.transaction = transaction
		}

		const [affectedCount] = await model.update(data as any, options)
		return affectedCount
	}

	/**
	 * 删除记录
	 */
	static async delete<T extends Model>(
		model: ModelStatic<T>,
		where: WhereOptions,
		transaction?: Transaction
	) {
		const options: DestroyOptions = { where }
		if (transaction) {
			options.transaction = transaction
		}

		return await model.destroy(options)
	}

	/**
	 * 根据ID查找
	 */
	static async findById<T extends Model>(
		model: ModelStatic<T>,
		id: number | string,
		params: Omit<QueryParams, 'pagenumber' | 'pagesize' | 'where'> = {},
		transaction?: Transaction
	) {
		const { attributes, include } = params
		const options: FindOptions = {
			...(attributes && { attributes }),
			...(include && { include })
		}
		if (transaction) {
			options.transaction = transaction
		}

		const result = await model.findByPk(id, options)
		return result ? DataUtil.toJSON(result) : null
	}
}

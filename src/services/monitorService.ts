import { BaseDao, QueryParams } from '../dao/baseDao'
import MonitorModel from '../model/monitorModel'
import { BusinessError } from '../utils/businessError'
import { MonitorMessage } from '../enums/monitor'
import os from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'
import { redis } from '../config/redis'

const execAsync = promisify(exec)

export class MonitorService {
	/**
	 * 获取系统监控数据
	 */
	async getSystemInfo() {
		try {
			// CPU信息
			const cpuUsage = await this.getCPUUsage()

			// 内存信息
			const totalMem = os.totalmem()
			const freeMem = os.freemem()
			const memoryUsage = ((totalMem - freeMem) / totalMem) * 100

			// 磁盘信息
			const diskUsage = await this.getDiskUsage()

			// 系统负载
			const loadavg = os.loadavg()
			const systemLoad = loadavg.map((load) => load.toFixed(2)).join(', ')

			// 网络IO
			const networkIO = await this.getNetworkIO()

			// 在线用户数（从Redis获取）
			const onlineUsers = await this.getOnlineUsers()

			// 系统运行时间
			const uptime = os.uptime()

			// 保存监控数据
			const monitorData = {
				cpu_usage: cpuUsage,
				memory_usage: memoryUsage,
				disk_usage: diskUsage,
				system_load: systemLoad,
				network_io: networkIO,
				online_users: onlineUsers,
				uptime
			}

			await BaseDao.create(MonitorModel, monitorData)

			return {
				...monitorData,
				os_type: os.type(),
				os_platform: os.platform(),
				os_arch: os.arch(),
				os_release: os.release(),
				hostname: os.hostname()
			}
		} catch (error) {
			throw new BusinessError(MonitorMessage.GET_ERROR)
		}
	}

	/**
	 * 获取历史监控数据
	 */
	async getHistory(params: QueryParams) {
		return await BaseDao.findByPage(MonitorModel, {
			...params,
			order: [['created_at', 'DESC']]
		})
	}

	/**
	 * 获取CPU使用率
	 */
	private async getCPUUsage(): Promise<number> {
		const cpus = os.cpus()
		const totalIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0)
		const totalTick = cpus.reduce(
			(acc, cpu) =>
				acc +
				cpu.times.idle +
				cpu.times.user +
				cpu.times.sys +
				cpu.times.nice,
			0
		)
		const usage = ((totalTick - totalIdle) / totalTick) * 100
		return Number(usage.toFixed(2))
	}

	/**
	 * 获取磁盘使用率
	 */
	private async getDiskUsage(): Promise<number> {
		try {
			const { stdout } = await execAsync(
				"df -h / | tail -1 | awk '{print $5}'"
			)
			return Number(stdout.trim().replace('%', ''))
		} catch (error) {
			return 0
		}
	}

	/**
	 * 获取网络IO
	 */
	private async getNetworkIO(): Promise<string> {
		const networkInterfaces = os.networkInterfaces()
		let totalRx = 0
		let totalTx = 0

		Object.values(networkInterfaces).forEach((interfaces) => {
			interfaces?.forEach((interface_) => {
				if (!interface_.internal) {
					// 这里只是示例，实际需要通过其他方式获取实时网络IO
					totalRx += Math.random() * 1000
					totalTx += Math.random() * 1000
				}
			})
		})

		return `↓${(totalRx / 1024).toFixed(2)}KB/s ↑${(totalTx / 1024).toFixed(2)}KB/s`
	}

	/**
	 * 获取在线用户数
	 */
	private async getOnlineUsers(): Promise<number> {
		try {
			const onlineUsers = await redis.keys('online:*')
			return onlineUsers.length
		} catch (error) {
			return 0
		}
	}
}

export const monitorService = new MonitorService()

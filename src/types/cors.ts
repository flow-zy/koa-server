export interface CorsConfig {
	origins: string[]
	methods: string[]
	allowHeaders: string[]
	credentials: boolean
	maxAge: number
	exposeHeaders: string[]
	security: boolean
	logging: boolean
}

export type CorsOptions = Partial<CorsConfig>

import path from 'node:path'
import { SwaggerRouter } from 'koa-swagger-decorator'

const router = new SwaggerRouter()
router.swagger({
	title: 'api 文档',
	description: 'api 文档',
	swaggerHtmlEndpoint: '/apidocs',
	version: '0.0.0',
	swaggerConfiguration: {
		display: {
			defaultModelsExpandDepth: 4,
			defaultModelExpandDepth: 3,
			docExpansion: 'list',
			defaultModelRendering: 'model'
		}
	}
})
router.mapDir(path.resolve(__dirname, '../controllers'))
export default router

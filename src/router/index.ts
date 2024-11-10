import path from 'node:path'

import { SwaggerRouter } from 'koa-swagger-decorator'

const router = new SwaggerRouter()
router.swagger({
  title: 'api 文档',
  description: 'api 文档',
  swaggerHtmlEndpoint: '/apidocs',
})
router.mapDir(path.resolve(__dirname, '../controllers'))
export default router

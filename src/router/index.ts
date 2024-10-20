import { SwaggerRouter } from 'koa-swagger-decorator';
import path from 'path';
const router = new SwaggerRouter();
router.swagger({
	title: 'api 文档',
	description: 'api 文档',
	swaggerHtmlEndpoint: '/apidocs'
});
router.mapDir(path.resolve(__dirname, '../controller'));
export default router;

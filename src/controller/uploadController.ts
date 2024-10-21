import { request, tags } from 'koa-swagger-decorator';

export default class UploadController {
	@request('post', '/upload')
	@tags(['图片上传'])
	static async upload(ctx: any) {
		const file = ctx.request.files.file; // file 是前端表单中文件输入的名称
		if (file) {
			// 处理文件，例如保存到服务器等
			return ctx.send('上传成功', 200, {
				url: `/uploads/${file.newFilename}`
			});
		} else {
			ctx.status = 400;
			ctx.body = { message: '没有文件被上传', code: 201 };
		}
	}
}

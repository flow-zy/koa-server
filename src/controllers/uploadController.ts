import { request, summary, tags } from 'koa-swagger-decorator'

export default class UploadController {
  @request('post', '/upload')
  @tags(['Upload'])
  @summary(['图片上传'])
  static async upload(ctx: any) {
    const file = ctx.request.files.file // file 是前端表单中文件输入的名称
    if (file) {
      // 处理文件，例如保存到服务器等
      return ctx.success(`/uploads/${file.newFilename}`, '上传成功')
    }
    else {
      return ctx.error('没有文件被上传')
    }
  }
}

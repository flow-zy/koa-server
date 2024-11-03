import fs from 'node:fs'

import processEnv from '../config/config.default'

import COS from 'cos-nodejs-sdk-v5'

const cos = new COS({
  SecretId: processEnv.SecretId,
  SecretKey: processEnv.SecretKey,
})
const Bucket = processEnv.Bucket

// 上传图片到cos
export async function uploadFile(filePath: string,	fileName: string,	path: string) {
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket:Bucket!,
        Region: 'ap-nanchang',
        Key: `flockmaster-blogs/${path}/${fileName}`,
        Body: fs.createReadStream(filePath),
        ContentLength: fs.statSync(filePath).size,
        ContentType: 'image/jpeg',
      },
      (err: unknown, data: unknown) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(data)
        }
      },
    )
  })
}

// 删除cos文件
export async function deleteObject(key: string) {
  return new Promise((resolve, reject) => {
    cos.deleteObject(
      {
        Bucket: Bucket!,
        Region: 'ap-nanchang',
        Key: key,
      },
      (err, data) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(data)
        }
      },
    )
  })
}

export function getObjectUrl(key: string) {
  return cos.getObjectUrl({
    Bucket:Bucket!,
    Region: 'ap-nanchang',
    Key: key,
    Expires: 3600, // URL 过期时间，单位秒，默认 300 秒
  }, () => {

  })
}

import fs from 'fs';
import compressing from 'compressing';
import path from 'path';
import https from 'https';
import fg from 'fast-glob';
import qiniu from 'qiniu';
import crypto from 'crypto';
import { rimrafSync } from 'rimraf';
const key = '9vApxLk5G3PAsJrM';

// 下载字体压缩包
export const download = (pid: string, save_path: string, cookie: string) => {
  return new Promise((resolve, reject) => {
    https.get(`https://www.iconfont.cn/api/project/download.zip?pid=${pid}`, { headers: { Cookie: cookie } }, (res: any) => {
      if (res.statusCode !== 200 || !res?.headers['content-type'].includes('application/zip')) {
        console.error('下载失败，请尝试更换cookie重试或检查pid是否正确');
        reject('下载失败，请尝试更换cookie重试或检查pid是否正确');
        return;
      }
      const totalSize = parseInt(res.headers['content-length'] || '0', 10);
      let downloadedSize = 0;
      res.on('data', (chunk: any) => {
        downloadedSize += chunk.length;
        const progress = Math.round((downloadedSize / totalSize) * 100);
        console.log(`Download progress: ${progress}%`);
      });
      const chunks: any[] = [];
      res.on('data', (chunk: any) => {
        chunks.push(chunk);
      });
      res.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        // 将 buffer 保存为zip文件
        fs.writeFileSync(save_path, buffer);
        console.log('Download completed');
        resolve(true);
      });
    });
  });
};

// 解压文件
export const unzip = (file: string) => {
  return new Promise((resolve, reject) => {
    compressing.zip
      .uncompress(file, file.replace('.zip', ''))
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// download.zip 解压后的名称会议font_开头，借助这个特性进行文件重命名
export async function handleRename(filePath: string) {
  const dirs = fs.readdirSync(filePath);
  for (const dir of dirs) {
    if (dir.startsWith('font_')) {
      fs.renameSync(path.join(filePath, dir), path.join(filePath, 'iconfont'));
      break;
    }
  }
}

// 匹配文件
export async function matchFile(path: string, suffix: string[]) {
  console.log('匹配文件的路径', path);
  const files = await fg(suffix, { dot: true, cwd: path });
  return files;
}

// 七牛签名
export const qiniuUpload = (qiniuconfig: QiniuConfig, redirPath: string, file: string) => {
  return new Promise((reslove, reject) => {
    const accessKey = aesDecrypt(qiniuconfig.accessKey);
    const secretKey = aesDecrypt(qiniuconfig.secretKey);
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: `${qiniuconfig.bucket}:${qiniuconfig.bucketPath}/${file}`,
    };
    const config = new qiniu.conf.Config();
    // @ts-ignore
    config.zone = qiniu.zone[qiniuconfig.zone];
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const url = path.join(redirPath, `./iconfont/${file}`);

    formUploader.putFile(uploadToken, `${qiniuconfig.bucketPath}/${file}`, url, putExtra, (err, respBody, respInfo) => {
      if (respInfo.statusCode == 200) {
        reslove(respBody);
      } else {
        reject(respBody);
      }
    });
  });
};

// 七牛上传
export const qiniuOssUpload = async (files: string[], redirPath: string, qiniuconfig: QiniuConfig) => {
  const arr = [];
  for (let i = 0; i < files.length; i++) {
    const item = files[i];
    await qiniuUpload(qiniuconfig, redirPath, item);
    arr.push(item);
  }
  console.log(`共计上传${arr.length}个文件`, arr);
};

// AES 加密
export function aesEncrypt(message: string) {
  const cipher = crypto.createCipheriv('aes128', key, key);
  let crypted = cipher.update(message, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

// AES 解密
export function aesDecrypt(text: string) {
  const cipher = crypto.createDecipheriv('aes128', key, key);
  let decrypted = cipher.update(text, 'hex', 'utf8');
  decrypted += cipher.final('utf8');
  return decrypted;
}

// 替换iconfont中链接
export function replaceIconfontLink(filePath: string, cdn_url: string, bucketUrl: string, localPath: string) {
  const css = path.join(filePath, './iconfont/iconfont.css');
  const result = fs.readFileSync(css).toString();
  const attrs = ['iconfont.woff', 'iconfont.ttf', 'iconfont.svg'];
  let str = result;
  for (let i = 0; i < attrs.length; i++) {
    const item = attrs[i];
    const reg = new RegExp(item, 'ig');
    str = str.replace(reg, `${cdn_url}/${bucketUrl}/${item}`);
  }
  if (!fs.existsSync(localPath)) {
    console.log(`本地css文件不存在,${localPath}`);
    return;
  }
  fs.writeFileSync(localPath, str);
  // 写入成功
  rimrafSync(path.join(__dirname, './iconfont'));
  rimrafSync(path.join(__dirname, './iconfont.zip'));
  console.log('success!');
}

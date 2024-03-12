import path from 'path';
import { download, unzip, handleRename, matchFile, qiniuOssUpload, replaceIconfontLink } from './util';
export class ZippyIconfont {
  private config: ZippyIconfontConfig;
  private save_path: string;
  constructor(config: ZippyIconfontConfig) {
    this.config = config;
    this.save_path = path.join(__dirname, 'iconfont.zip');
  }
  async start() {
    const iconfontDir = path.join(__dirname, 'iconfont');
    console.log('√ 开始下载iconfont文件...');
    await download(this.config.pid, this.save_path, this.config.cookie);
    console.log('√ 开始解压iconfont文件...');
    await unzip(this.save_path);
    console.log('√ 开始修改iconfont文件...');
    // 删除多余的文件
    handleRename(iconfontDir);

    const files = await matchFile(path.join(iconfontDir, 'iconfont'), this.config.suffix);
    // 处理上传
    return files;
  }

  async iconUpload(files: string[], config: UploadParams) {
    // 允许上次的oss配置
    const allowOssNames = ['qiniu'];
    const objectKeys = Object.keys(config || {});
    const need_oss = allowOssNames.filter((item) => objectKeys.includes(item));
    if (need_oss.length === 0) {
      console.error('请配置oss上传参数');
      return;
    }
    const obj = {
      qiniu: (files: string[], redirPath: string, qiniuconfig: QiniuConfig) => qiniuOssUpload(files, redirPath, qiniuconfig),
    };

    let bucketPath = '';

    const redirpath = path.join(__dirname, 'iconfont');
    for (let i = 0; i <= need_oss.length; i++) {
      const item = need_oss[i];
      // @ts-ignore
      await obj[item]?.(files, redirpath, config[item]);
      // @ts-ignore
      bucketPath = config[item]?.bucketPath;
    }

    // 修改iconfont链接
    replaceIconfontLink(redirpath, this.config.cdn_url, bucketPath, this.config.local_path);
  }
}

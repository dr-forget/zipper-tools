interface ZippyIconfontConfig {
  cookie: string;
  pid: string;
  cdn_url: string;
  local_path: string; //本地css地址 自动修改该文件的地址
  // 文件后缀匹配
  suffix: string[]; //示例 ['*.css','*.html']
}

interface UploadParams {
  qiniu?: QiniuConfig;
}
interface QiniuConfig {
  accessKey: string;
  secretKey: string;
  bucketPath: string;
  bucket: string;
  zone: string;
}

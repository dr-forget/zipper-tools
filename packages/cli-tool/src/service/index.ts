import { createServer } from "vite";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
export class Service {
  constructor() {}
  async start() {
    //获取项目路径
    const prod_project_path = fileURLToPath(import.meta.url);
    const config_root = join(dirname(prod_project_path), "../tool/vite.config.mjs");
    const server = await createServer({
      // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
      configFile: config_root,
      root: process.cwd(),
      mode: process.env.NODE_ENV as string,
    });
    await server.listen();
    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  }
}

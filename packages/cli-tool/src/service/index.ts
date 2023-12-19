import { createServer, build, preview } from 'vite';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path, { dirname, join } from 'path';
export class Service {
  public config_root: string;
  constructor() {
    const prod_project_path = fileURLToPath(import.meta.url);
    this.config_root = join(dirname(prod_project_path), '../tool/vite.config.mjs');
  }
  async start() {
    //获取项目路径

    const server = await createServer({
      // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
      configFile: this.config_root,
      root: process.cwd(),
      mode: process.env.NODE_ENV as string,
    });
    await server.listen();
    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  }
  async build() {
    await build({
      root: process.cwd(),
      mode: process.env.NODE_ENV as string,
      // base: './',
      configFile: this.config_root,
    });
  }
  async preview(mode: 'cli' | 'server', previewUrl?: string) {
    let outdir = previewUrl || '';
    if (mode === 'cli') {
      // 获取build.json
      const meta_url = fileURLToPath(import.meta.url);
      const url = path.join(path.dirname(meta_url), '../build.json');
      if (!fs.existsSync(url)) {
        console.log('use tiger build first');
        return;
      }
      const build_config = JSON.parse(fs.readFileSync(url, 'utf-8'));
      outdir = build_config.outDir;
    }
    const previewServer = await preview({
      build: {
        outDir: outdir,
      },
      preview: {
        port: 8080,
        open: true,
      },
    });

    previewServer.printUrls();
    previewServer.bindCLIShortcuts({ print: true });
  }
}

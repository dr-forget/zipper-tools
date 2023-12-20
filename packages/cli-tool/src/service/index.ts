import { createServer, build, preview } from 'vite';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path, { dirname, join } from 'path';

interface PreviewOptions {
  mode: 'cli' | 'server';
  previewUrl?: string;
  host?: {
    port: number;
    open: boolean;
  };
}

export class Service {
  public config_root: string;
  public buildConfig_root: string;
  constructor() {
    const prod_project_path = fileURLToPath(import.meta.url);
    this.config_root = join(dirname(prod_project_path), '../tool/vite.config.mjs');
    const meta_url = fileURLToPath(import.meta.url);
    this.buildConfig_root = path.join(path.dirname(meta_url), '../build.json');
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
    const build_config = JSON.parse(fs.readFileSync(this.buildConfig_root, 'utf-8'));
    if (build_config.build_open) {
      this.preview({
        mode: 'server',
        previewUrl: path.join(process.cwd(), './analysis'),
        host: {
          port: 7702,
          open: true,
        },
      });
    }
  }
  async preview({ mode, previewUrl, host }: PreviewOptions) {
    let outdir = previewUrl || '';
    if (mode === 'cli') {
      // 获取build.json
      if (!fs.existsSync(this.buildConfig_root)) {
        console.log('use zippybee build first');
        return;
      }
      const build_config = JSON.parse(fs.readFileSync(this.buildConfig_root, 'utf-8'));
      outdir = build_config.outDir;
    }
    const previewServer = await preview({
      configFile: false,
      build: {
        outDir: outdir,
      },
      preview: {
        port: host?.port || 7001,
        open: host?.open || false,
        host: true,
      },
    });

    previewServer.printUrls();
    previewServer.bindCLIShortcuts({ print: true });
  }
}

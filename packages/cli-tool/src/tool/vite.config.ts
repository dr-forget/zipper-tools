import { PluginOption, mergeConfig, defineConfig, UserConfig, build } from 'vite';
import { readRootcliConfig } from './tool';
import { plugins } from './plugin';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

export default defineConfig(async (params) => {
  let config: UserConfig = {};
  const tigercli_env = JSON.parse(process.env.tigercli_env || '{}');
  const baseConfig = await readRootcliConfig();
  const Allplugins: PluginOption[] = plugins(tigercli_env.stack, baseConfig.config);
  const default_config: UserConfig = {
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), './src'),
      },
    },
    server: {
      port: tigercli_env.port,
      host: true,
      hmr: true,
    },
    plugins: Allplugins,
    build: {
      assetsDir: 'static/image',
      target: tigercli_env.target,
      outDir: tigercli_env.output_path,
      minify: 'terser',
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  };
  // 调用用户自定义vite配置
  if (baseConfig.config.custom_vite_config) {
    config = await baseConfig.config.custom_vite_config(params);
  }
  const merge_Config = mergeConfig(default_config, config);
  if (params.command === 'build') {
    const meta_url = fileURLToPath(import.meta.url);
    const url = path.join(path.dirname(meta_url), '../build.json');
    // 依赖分析打包 是否自动打开浏览
    const isopen = baseConfig.config.analyzeDependencies.enable && baseConfig.config.analyzeDependencies.open;
    fs.writeFileSync(url, JSON.stringify({ ...merge_Config.build, build_open: isopen }, null, 2));
  }
  return merge_Config;
});

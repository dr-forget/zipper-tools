import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import { importToCDN, autoComplete } from '@zippybee/plugin-cdn-import';
import AutoComponents from 'unplugin-vue-components/vite';
import { ModuleName } from '@zippybee/plugin-cdn-import/dist/auto-complete';
import { createHtmlPlugin } from '@zippybee/plugin-html';
import { CustomConfigProps } from './type';
import { visualizer } from 'rollup-plugin-visualizer';
import { PluginOption } from 'vite';
import { merge } from 'lodash-es';

interface IPlugin {
  react: PluginOption[];
  vue: PluginOption[];
}

// 指定技术栈的插件
const stack_plugins: IPlugin = {
  react: [react()],
  vue: [vue()],
};

export const stackPlugins = (technology_stack: 'vue' | 'react'): PluginOption[] => {
  return stack_plugins[technology_stack] || [];
};

const read_backend_envconfig = (shortpath: string) => {
  const env_path = path.join(process.cwd(), shortpath);
  if (fs.existsSync(env_path)) {
    return JSON.parse(fs.readFileSync(env_path, 'utf-8'));
  }
  return {};
};

const insert_plugin = (technology_stack: 'vue' | 'react', baseConfig: CustomConfigProps): PluginOption[] => {
  const plugins: PluginOption[] = [];
  if (baseConfig.vueIsJsx && technology_stack === 'vue') {
    plugins.push(vueJsx());
  }
  if (baseConfig.analyzeDependencies.enable) {
    plugins.push(
      visualizer({
        emitFile: false,
        brotliSize: true,
        gzipSize: true,
        filename: 'analysis/index.html',
      }),
    );
  }
  // html插件
  if (baseConfig.html_plugin.enable) {
    const { config, template } = baseConfig.html_plugin;
    // 读取配置文件
    const zippybeecli_env = JSON.parse(process.env.zippybeecli_env || '{}');
    // 获取当前运行的环境变量
    const env = zippybeecli_env.backend_env;
    // 读取公共配置文件
    const common_env_json = config?.commonfileName ? read_backend_envconfig(`/config/${config?.commonfileName}.json`) : {};
    // 当前环境变量配置信息
    const env_json = read_backend_envconfig(`/config/${env}.json`);
    // 读取忽略配置文件
    const ignore_env_json = config?.ignorefileName ? read_backend_envconfig(`/config/${config?.ignorefileName}.json`) : {};
    // 合并配置
    const config_json = merge(common_env_json, env_json, ignore_env_json);
    // 获取package.json
    const pkg = read_backend_envconfig('package.json');
    // 获取html模板路径
    const template_path = path.join(process.cwd(), template || 'index.html');
    plugins.push(
      createHtmlPlugin({
        minify: true,
        template: template_path,
        inject: {
          data: {
            ...baseConfig.html_plugin.injectData,
            injectScript: `<script id="runconfig">window.zippybeecli_backend = ${JSON.stringify({
              ...config_json,
              buildTime: +new Date(),
              version: pkg.version,
            })}</script>`,
          },
        },
      }),
    );
  }
  // cdn插件
  if (baseConfig.package_cdn.modules.length > 0) {
    const { modules, cdnUrl } = baseConfig.package_cdn;
    const config_modules = modules.map((item) => {
      if (typeof item === 'string') {
        return autoComplete(item as ModuleName);
      } else {
        return item;
      }
    });
    plugins.push(
      importToCDN({
        modules: config_modules,
        prodUrl: cdnUrl || 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}',
      }),
    );
  }
  if (baseConfig.polyfill.enable) {
    plugins.push(
      legacy({
        targets: baseConfig.polyfill.targets,
      }),
    );
  }
  if (baseConfig.isAutoComponent && baseConfig.isAutoComponent.resolvers?.length && technology_stack == 'vue') {
    plugins.push(AutoComponents({ ...baseConfig.isAutoComponent }));
  }
  return plugins;
};

export const plugins = (technology_stack: 'vue' | 'react', baseConfig: CustomConfigProps): PluginOption[] => {
  const stack_plugins = stackPlugins(technology_stack);
  // 根据配置文件插入插件
  const insert_plugins = insert_plugin(technology_stack, baseConfig);

  return stack_plugins.concat(insert_plugins);
};
export default {
  createHtmlPlugin,
  visualizer,
  importToCDN,
};

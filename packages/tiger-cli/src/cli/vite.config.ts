import { CustomConfigProps } from './type';
import { PluginOption, mergeConfig, defineConfig, UserConfig } from 'vite';
import { readRootcliConfig } from './tool';
import { plugins } from './plugin';
import path from 'path';

export default defineConfig(async (params) => {
  let config: UserConfig = {};
  const tigercli_env = JSON.parse(process.env.tigercli_env || '{}');
  const baseConfig = await readRootcliConfig();
  const Allplugins: PluginOption[] = plugins(tigercli_env.stack, baseConfig.config);
  console.log(Allplugins, 12);
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
  };
  // 调用用户自定义vite配置
  if (baseConfig.config.custom_vite_config) {
    config = await baseConfig.config.custom_vite_config(params);
  }
  return mergeConfig(default_config, config);
});

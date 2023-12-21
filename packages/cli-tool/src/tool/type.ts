import { UserConfig, ConfigEnv } from 'vite';
import { Module } from '@zippybee/plugin-cdn-import/dist/type';
import { ModuleName } from '@zippybee/plugin-cdn-import/dist/auto-complete';
import { Options } from 'unplugin-vue-components';

export interface zippyEnv extends ConfigEnv {
  env: string;
}

export interface CustomConfigProps {
  vueIsJsx: boolean;
  analyzeDependencies: {
    enable: boolean;
    open: boolean;
  };
  polyfill: {
    enable: boolean;
    targets: string[];
  };
  html_plugin: {
    enable: boolean;
    template?: string;
    injectData: {
      [key: string]: string;
    };
    config?: {
      commonfileName?: string;
      ignorefileName?: string;
    };
  };
  package_cdn: {
    modules: ModuleName[] | Array<(prodUrl: string) => Module>;
    cdnUrl?: string;
  };
  isAutoComponent: Options;
  custom_vite_config: (data: zippyEnv) => UserConfig | Promise<UserConfig>;
}

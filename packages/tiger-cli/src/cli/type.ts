import { UserConfig, ConfigEnv } from 'vite';
export interface Module {
  name: string;
  var: string;
  path: string | string[];
  css?: string | string[];
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
  custom_vite_config: (data: ConfigEnv) => UserConfig | Promise<UserConfig>;
}

export type ModuleName =
  | 'react'
  | 'react-dom'
  | 'react-router-dom'
  | 'antd'
  | 'ahooks'
  | '@ant-design/charts'
  | 'vue'
  | 'vue2'
  | '@vueuse/shared'
  | '@vueuse/core'
  | 'moment'
  | 'eventemitter3'
  | 'file-saver'
  | 'browser-md5-file'
  | 'xlsx'
  | 'axios'
  | 'lodash'
  | 'crypto-js'
  | 'localforage';

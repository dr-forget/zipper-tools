import { CustomConfigProps } from './type';
const config: CustomConfigProps = {
  //vue 是否开启jsx支持 默认不开启
  vueIsJsx: false,
  //  是否分析依赖包大小
  analyzeDependencies: {
    //    是否开启
    enable: false,
    //    是否默认打开浏览器
    open: false,
  },
  // 是否开启低版本浏览器兼容
  polyfill: {
    //    是否开启
    enable: false,
    //    是否默认打开浏览器
    targets: ['ie >= 11'],
  },
  html_plugin: {
    enable: false,
    template: 'index.html',
    injectData: {
      title: 'Zippy Vite',
    },
  },
  package_cdn: {
    modules: [],
    cdnUrl: '',
  },
  isAutoComponent: {
    dts: false,
    dirs: [],
    resolvers: [],
  },
  // 其他自定义vite配置
  custom_vite_config: () => {
    return {};
  },
};
export default config;

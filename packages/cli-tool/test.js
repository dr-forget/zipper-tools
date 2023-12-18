const modulesConfig = {
  react: {},
  'react-dom': {},
  'react-router-dom': {},
  antd: {},
  ahooks: {},
  '@ant-design/charts': {},
  vue: {},
  vue2: {},
  '@vueuse/shared': {},
  '@vueuse/core': {},
  moment: {},
  eventemitter3: {},
  'file-saver': {},
  'browser-md5-file': {},
  xlsx: {},
  axios: {},
  lodash: {},
  'crypto-js': {},
  localforage: {},
};
let str = '';
const type = Object.keys(modulesConfig).map((item) => {
  str += `'${item}'|`;
});
console.log(str);

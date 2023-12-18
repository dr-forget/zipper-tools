import fs from 'fs';
import path from 'path';
import baseConfig from './base.config';
import { buildSync } from 'esbuild';
import { merge } from 'lodash-es';

interface IConfigFile {
  filepath: string;
  filetype: 'ts' | 'js';
}

export const checkConfigFileExists = (filename: string): IConfigFile | null => {
  const tsFilePath = path.resolve(process.cwd(), `${filename}.ts`);
  const jsFilePath = path.resolve(process.cwd(), `${filename}.mjs`);

  if (fs.existsSync(tsFilePath)) {
    return {
      filepath: tsFilePath,
      filetype: 'ts',
    };
  }
  if (fs.existsSync(jsFilePath)) {
    return {
      filepath: jsFilePath,
      filetype: 'js',
    };
  }
  return null;
};

export const RunCliConfig = (config: IConfigFile) => {
  if (config.filetype === 'ts') {
    return runTsConfig(config);
  }
  if (config.filetype === 'js') {
    return RunJsConfig(config);
  }
};

const runTsConfig = async (config: IConfigFile) => {
  const fileContent = fs.readFileSync(config.filepath, 'utf-8');
  const result = buildSync({
    stdin: {
      contents: fileContent,
      loader: 'ts',
    },
    format: 'cjs',
    write: false, // 不写入文件，仅转译
  });
  const transpiledCode = result.outputFiles[0].text;
  // 创建新的函数
  const jsConfig = new Function('module', transpiledCode);
  // 调用新创建的函数
  const moduleExports = {
    exports: {
      default: {},
    },
  };
  jsConfig(moduleExports);
  return moduleExports.exports.default;
};

const RunJsConfig = async (config: IConfigFile) => {
  const module = await import(config.filepath); // 动态导入外部模块
  return module.default;
};

// 读取根目录下的配置文件
export const readRootcliConfig = async () => {
  const cliConfig_root = checkConfigFileExists('tiger-cli');
  // 如果存在该配置文件则读取配置文件
  if (cliConfig_root) {
    const config = await RunCliConfig(cliConfig_root);
    return { isrunCustomFn: true, config: merge(baseConfig, config) };
  }
  return { isrunCustomFn: false, config: baseConfig };
};
// 获取项目的技术栈
export const getTechnologyStack = () => {
  const pwd = process.cwd();
  const pwd_package_root = path.join(pwd, 'package.json');
  const pwd_package_root_json = JSON.parse(fs.readFileSync(pwd_package_root, 'utf-8'));
  // 技术栈
  if (pwd_package_root_json.dependencies.hasOwnProperty('react')) {
    return 'react';
  }
  if (pwd_package_root_json.dependencies.hasOwnProperty('vue')) {
    return 'vue';
  }
  return '';
};

export const isStringArray = (arr: any[]) => {
  if (!Array.isArray(arr)) {
    return false; // 不是数组
  }

  // 检查数组中的元素是否都是字符串类型
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== 'string') {
      return false; // 不是字符串类型
    }
  }

  return true; // 是数组并且数组中的元素都是字符串类型
};

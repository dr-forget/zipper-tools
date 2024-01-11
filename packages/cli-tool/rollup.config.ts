import fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import globFast from 'fast-glob';
import { cleandir } from 'rollup-plugin-cleandir';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const commpireTs = globFast.sync(['src/**/*.ts'], { dot: true });

const excludefiles = ['cli2/vite.config.mjs'];

const prod_project_path = fileURLToPath(import.meta.url);
const config_root = join(dirname(prod_project_path), 'package.json');
const pkg = JSON.parse(fs.readFileSync(config_root, 'utf-8'));
const external = Object.keys(pkg.dependencies || {});

function customTerser(options = {}) {
  return {
    name: 'custom-terser',
    async renderChunk(code, chunk) {
      if (excludefiles.includes(chunk.fileName)) {
        return null; // 返回 null 表示排除此文件的压缩和混淆
      }
      // @ts-ignore
      return terser(options).renderChunk(code, chunk, options);
    },
  };
}

export default [
  {
    input: commpireTs, // 输入文件路径
    output: {
      dir: 'lib', // 输出文件路径
      format: 'es', // 输出模块格式为 ES 规范
      preserveModules: true, // 保留模块路径信息
      entryFileNames: '[name].mjs', // 输出文件名格式
      chunkFileNames: '[name]-[hash].mjs',
      esModule: true,
      banner: (chunk) => {
        if (chunk.name == 'tool/cli') {
          return '#!/usr/bin/env node';
        }
        return '';
      },
    },
    plugins: [
      cleandir('lib'), // 清空输出目录
      typescript({
        sourceMap: false,
      }),
      process.env.NODE_ENV == 'production'
        ? customTerser({
            compress: {
              dead_code: true,
              drop_console: true,
              drop_debugger: true,
            },
            mangle: {
              toplevel: true,
              keep_fnames: false,
            },
            format: {
              comments: false,
            },
          })
        : null,

      // 使用 @rollup/plugin-typescript 处理 TypeScript 文件
    ],
    external: [...external, 'url', 'path', 'fs'], // 如果有需要排除的外部依赖项，可以在这里添加
  },
  {
    input: ['./resolves/index.ts'],
    output: [
      {
        dir: 'dist', // 输出文件路径
        format: 'es', // 输出模块格式为 ES 规范
        entryFileNames: '[name].mjs', // 输出文件名格式
        chunkFileNames: '[name]-[hash].mjs',
        esModule: true,
      },
      {
        dir: 'dist', // 输出文件路径
        format: 'cjs', // 输出模块格式为 ES 规范
        entryFileNames: '[name].js', // 输出文件名格式
        chunkFileNames: '[name]-[hash].js',
      },
    ],
    plugins: [
      cleandir('dist'), // 清空输出目录
      typescript({
        sourceMap: false,
        outDir: './dist',
        include: ['./resolves/*.ts'],
      }),
      process.env.NODE_ENV == 'production'
        ? customTerser({
            compress: {
              dead_code: true,
              drop_console: false,
              drop_debugger: true,
            },
            mangle: {
              toplevel: true,
              keep_fnames: false,
            },
            format: {
              comments: false,
            },
          })
        : null,

      // 使用 @rollup/plugin-typescript 处理 TypeScript 文件
    ],
    external: [...external, 'url', 'path', 'fs'], // 如果有需要排除的外部依赖项，可以在这里添加
  },
];

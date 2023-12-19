import fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { cleandir } from 'rollup-plugin-cleandir';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export default {
  input: ['src/index.ts'], // 输入文件路径
  output: [
    {
      dir: 'dist', // 输出文件路径
      format: 'es', // 输出模块格式为 ES 规范
      preserveModules: true, // 保留模块路径信息
      entryFileNames: '[name].mjs', // 输出文件名格式
      chunkFileNames: '[name]-[hash].mjs',
      esModule: true,
    },
    {
      dir: 'dist', // 输出文件路径
      format: 'cjs', // 输出模块格式为 ES 规范
      preserveModules: true, // 保留模块路径信息
      entryFileNames: '[name].js', // 输出文件名格式
      chunkFileNames: '[name]-[hash].js',
    },
  ],
  plugins: [
    cleandir('dist'), // 清空输出目录
    typescript({
      sourceMap: false,
    }),
    process.env.NODE_ENV == 'production'
      ? terser({
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
  ],
  external: ['url', 'path', 'fs'], // 如果有需要排除的外部依赖项，可以在这里添加
};

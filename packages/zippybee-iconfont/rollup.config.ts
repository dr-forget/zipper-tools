import typescript from "@rollup/plugin-typescript";
import globFast from "fast-glob";
import terser from "@rollup/plugin-terser";

export default {
  input: globFast.sync(["src/**/*.ts"], { dot: true }),
  output: {
    dir: "lib",
    format: "cjs",
    preserveModules: true, // 保留模块路径信息
    entryFileNames: "[name].js", // 输出文件名格式
    chunkFileNames: "[name]-[hash].js", // 输出文件名格式
  },
  plugins: [
    typescript({
      sourceMap: false,
    }),
    process.env.NODE_ENV == "production" ? terser() : null,
  ],
};

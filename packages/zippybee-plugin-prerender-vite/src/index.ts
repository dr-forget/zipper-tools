import type { Plugin, ResolvedConfig } from 'vite';
import { RenderPluginType } from './type';
import { renderStart } from './tool';
import chalk from 'chalk';
import path from 'path';
export const render = renderStart;

export function prerender(options?: RenderPluginType): Plugin {
  // @ts-ignore
  let config: ResolvedConfig;
  let outputPath: string = '';

  const emptyPlugin: Plugin = {
    name: 'vite:prerender',
  };

  return {
    ...emptyPlugin,
    apply: 'build',
    enforce: 'post',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outputPath = path.isAbsolute(config.build.outDir) ? config.build.outDir : path.join(config.root, config.build.outDir);
    },
    closeBundle() {
      console.log(chalk.green(`preRender start:`));

      const render_config: RenderPluginType = {
        staticDir: path.isAbsolute(config.build.outDir) ? config.build.outDir : path.join(config.root, config.build.outDir),

        routers: [],
        indexPath: path.isAbsolute(config.build.outDir)
          ? path.join(config.build.outDir, 'index.html')
          : path.join(config.root, config.build.outDir, 'index.html'),
        server: {},
      };

      const run_config = Object.assign(render_config, options);

      renderStart(run_config, outputPath);
    },
  };
}

import Prerenderer from '@zippybee/prerender';
import PuppeteerRenderer from '@zippybee/prerender-puppteer';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { RenderPluginType } from './type';
import { mkdirp } from 'mkdirp';

export const RenderDom = PuppeteerRenderer;

export const renderStart = async (options: RenderPluginType, outDir: string) => {
  console.log(`All-routers:[${chalk.green(`${options.routers.join(', ')}`)}] `);

  const render_config = {
    headless: true, // 是否显示浏览器
    maxConcurrentRoutes: 10, //限制最大访问路由
    renderAfterDocumentEvent: 'load', // 等待事件触发后，再渲染
    renderAfterTime: 300, // 等待时间
    renderAfterElementExists: 'app', // 等待元素加载后，再渲染
  };

  const merge_render_config = Object.assign(render_config, options.rendererOptions);

  //   删除 rendererOptions
  delete options.rendererOptions;

  const prerenderer = new Prerenderer({
    ...options,
    staticDir: options.staticDir || '',
    renderer: new PuppeteerRenderer(merge_render_config),
  });

  try {
    //   初始化
    await prerenderer.initialize();
    //   渲染路由
    const routers = await prerenderer.renderRoutes(options.routers);
    //  遍历路由
    routers.map((route) => {
      if (!route.html) return;
      // 调用外部函数 格式化内部的html
      const routeItem = options.postProcess ? options.postProcess(route) : route;
      //   获取路由的绝对路径
      const htmlPath = path.join(outDir, `${routeItem.route}.html`);
      //   获取文件夹路径
      const dirname = path.dirname(htmlPath);
      //   创建文件夹
      mkdirp.sync(dirname);
      //   获取文件层级
      const level = htmlPath.replace(outDir, '').split(path.sep).filter(Boolean).length;

      //   根据层级修改相对路径
      const relativePath = level === 1 ? '' : new Array(level).fill('../').join('');

      //   修改html中的路径
      routeItem.html = routeItem.html.replace(
        /(href|src)="(?!http)(?!https)([^"]+)"/g,
        `$1="${relativePath.substring(0, relativePath.length - 1)}$2"`,
      );

      fs.writeFileSync(htmlPath, routeItem.html.trim());

      console.log(chalk.green(`render-router:${routeItem.route}`));
    });
    console.log(chalk.green(`render success`));
  } catch (e) {
    console.log(e, 'plugin error');
  } finally {
    prerenderer.destroy();
  }
};

import { PuppeteerRendererOptions } from '@prerenderer/renderer-puppeteer';
export interface RenderPluginType {
  staticDir?: string;
  outputDir?: string;
  indexPath?: string;
  routers: Array<string>;
  postProcess?: (renderedRoute: any) => any;
  minify?: Record<string, any>;
  server?: Record<string, any>;
  rendererOptions?: Partial<PuppeteerRendererOptions> ;
}

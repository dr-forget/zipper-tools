import { PuppeteerRendererOptions } from '@zippybee/prerender-puppteer';
export interface RenderPluginType {
  staticDir?: string;
  outputDir?: string;
  indexPath?: string;
  routers: Array<string>;
  postProcess?: (renderedRoute: any) => any;
  minify?: Record<string, any>;
  server?: Record<string, any>;
  renderOptions?: Partial<PuppeteerRendererOptions> ;
}

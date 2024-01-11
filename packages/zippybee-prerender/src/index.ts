import Prerenderer from './Prerenderer';
import PuppeteerRenderer from './puppteer/Renderer';
import IRenderer, { RenderedRoute, RendererConstructor } from './IRenderer';
import { PrerendererOptions, PrerendererFinalOptions } from './PrerendererOptions';
import { PuppeteerRendererOptions } from './puppteer/Options';
export type { PuppeteerRenderer, PuppeteerRendererOptions };

export type { RendererConstructor, IRenderer, Prerenderer, RenderedRoute, PrerendererOptions, PrerendererFinalOptions };

const defaultOptions = {
  Prerenderer,
  PuppeteerRenderer,
};

export default defaultOptions;

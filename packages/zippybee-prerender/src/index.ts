import Prerenderer from './Prerenderer';
import DeepMerge from './merge';
import IRenderer, { RenderedRoute, RendererConstructor } from './IRenderer';
import { PrerendererOptions, PrerendererFinalOptions } from './PrerendererOptions';

export type { RendererConstructor, IRenderer, Prerenderer, RenderedRoute, PrerendererOptions, PrerendererFinalOptions };
export default Prerenderer;
export * as DeepMerge from './merge';

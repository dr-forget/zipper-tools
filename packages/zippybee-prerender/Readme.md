<h1 align="center"><img width="42" style="vertical-align:middle" alt="" src="assets/logo.png?raw=true"> Prerenderer</h1>
<p align="center">
  <em>Fast, flexible, framework-agnostic prerendering for sites and SPAs.</em>
</p>

---

<div align="center">

[![test](https://img.shields.io/github/actions/workflow/status/Tofandel/prerenderer/tests.yml?label=Tests)](https://github.com/Tofandel/prerenderer/actions/workflows/tests.yml)
[![npm downloads](https://img.shields.io/npm/dt/@zippybee/prerender.svg)](https://www.npmjs.com/package/@zippybee/prerender)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)
[![license](https://img.shields.io/github/license/Tofandel/prerenderer.svg)](https://github.com/Tofandel/prerenderer/blob/master/LICENSE.md)

</div>

---

<div align="left">

# Monorepo for the following NPM packages

- [![npm version](https://img.shields.io/npm/v/@zippybee/prerender.svg?label=@zippybee/prerender)](https://www.npmjs.com/package/@zippybee/prerender)
- [![npm version](https://img.shields.io/npm/v/@prerenderer/renderer-jsdom.svg?label=@prerenderer/renderer-jsdom)](https://www.npmjs.com/package/@prerenderer/renderer-jsdom)
- [![npm version](https://img.shields.io/npm/v/@prerenderer/renderer-puppeteer.svg?label=@prerenderer/renderer-puppeteer)](https://www.npmjs.com/package/@prerenderer/renderer-puppeteer)
- [![npm version](https://img.shields.io/npm/v/@prerenderer/webpack-plugin.svg?label=@prerenderer/webpack-plugin)](https://www.npmjs.com/package/@prerenderer/webpack-plugin)
- [![npm version](https://img.shields.io/npm/v/@prerenderer/rollup-plugin.svg?label=@prerenderer/rollup-plugin)](https://www.npmjs.com/package/@prerenderer/rollup-plugin)

</div>

## About prerenderer

The goal of this package is to provide a simple, framework-agnostic prerendering solution that is easily extensible and
usable for any site or single-page-app.

Now, if you're not familiar with the concept of _prerendering_, you might predictably ask...

## What is Prerendering?

Recently, SSR (Server Side Rendering) has taken the JavaScript front-end world by storm. The fact that you can now
render your sites and apps on the server before sending them to your clients is an absolutely _revolutionary_ idea (and
totally not what everyone was doing before JS client-side apps got popular in the first place...)

However, the same criticisms that were valid for PHP, ASP, JSP, (and such) sites are valid for server-side rendering
today. It's slow, breaks fairly easily, and is difficult to implement properly.

Thing is, despite what everyone might be telling you, you probably don't _need_ SSR. You can get almost all the
advantages of it (without the disadvantages) by using **prerendering.** Prerendering is basically firing up a headless
browser, loading your app's routes, and saving the results to a static HTML file. You can then serve it with whatever
static-file-serving solution you were using previously. It _just works_ with HTML5 navigation and the likes. No need to
change your code or add server-side rendering workarounds.

In the interest of transparency, there are some use-cases where prerendering might not be a great idea.

- **Tons of routes** - If your site has hundreds or thousands of routes, prerendering will be really slow. Sure you only
  have to do it once per update, but it could take ages. Most people don't end up with thousands of static routes, but
  just in-case...
- **Dynamic Content** - If your render routes that have content that's specific to the user viewing it or other dynamic
  sources, you should make sure you have placeholder components that can display until the dynamic content loads on the
  client-side. Otherwise, it might be a tad weird.

## Example `prerenderer` Usage

(It's much simpler if you use `prerenderer` with webpack or another build system.)

**Input**

```
app/
├── index.html
└── index.js // Whatever JS controls the SPA, loaded by index.html
```

**Output**

```
app/
├── about
│   └── index.html // Static rendered /about route.
├── index.html // Static rendered / route.
├── index.js // Whatever JS controls the SPA, loaded by index.html
└── some
    └── deep
        └── nested
            └── route
                └── index.html // Static rendered nested route.
```

```js
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Prerenderer = require('@zippybee/prerender');

const prerenderer = new Prerenderer({
  // Required - The path to the app to prerender. Should have an index.html and any other needed assets.
  staticDir: path.join(__dirname, 'app'),
  // The plugin that actually renders the page.
  postProcess(renderedRoute) {
    // Replace all http with https urls and localhost to your site url
    renderedRoute.html = renderedRoute.html
      .replace(/http:/i, 'https:')
      .replace(/(https:\/\/)?(localhost|127\.0\.0\.1):\d*/i, process.env.CI_ENVIRONMENT_URL || '');
  },
});

// Initialize is separate from the constructor for flexibility of integration with build systems.
prerenderer
  .initialize()
  .then(() => {
    // List of routes to render.
    return prerenderer.renderRoutes(['/', '/about', '/some/deep/nested/route']);
  })
  .then((renderedRoutes) => {
    // renderedRoutes is an array of objects in the format:
    // {
    //   route: String (The route rendered)
    //   html: String (The resulting HTML)
    // }
    renderedRoutes.forEach((renderedRoute) => {
      try {
        // A smarter implementation would be required, but this does okay for an example.
        // Don't copy this directly!!!
        const outputDir = path.join(__dirname, 'app', renderedRoute.route);
        const outputFile = `${outputDir}/index.html`;

        mkdirp.sync(outputDir);
        fs.writeFileSync(outputFile, renderedRoute.html.trim());
      } catch (e) {
        // Handle errors.
      }
    });

    // Shut down the file server and renderer.
    return prerenderer.destroy();
  })
  .catch((err) => {
    // Shut down the server and renderer.
    return prerenderer.destroy();
    // Handle errors.
  });
```

## Available Renderers

- `@prerenderer/renderer-jsdom` - Uses [jsdom](https://npmjs.com/package/jsdom). Fast, but unreliable and
  cannot handle advanced usages. May not work with all front-end frameworks and apps.
- `@prerenderer/renderer-puppeteer` - Uses [puppeteer](https://github.com/puppeteer/puppeteer) to render pages in
  headless Chrome. Simpler and more reliable than the previous `ChromeRenderer`.

### Which renderer should I use?

**Use `@prerenderer/renderer-puppeteer` if:** You're prerendering up to a couple hundred pages.

**Use `@prerenderer/renderer-jsdom` if:** You need to prerender thousands upon thousands of pages, but quality isn't all
that important, and you're willing to work around issues for more advanced cases. (Programmatic SVG support, etc.)

> An alternative faster dom renderer using [linkedom](https://github.com/WebReflection/linkedom#readme) is being considered

## Documentation

All of the packages are strongly typed using typescript, if some documentation is missing or when in doubt, we recommend referring to the types which are self documenting

### Prerenderer Options

| Option          | Type                                                 | Required? | Default                   | Description                                                                                                                                                          |
| --------------- | ---------------------------------------------------- | --------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| staticDir       | String                                               | Yes       | None                      | The root path to serve your app from. (If you are using a plugin, you don't need to set this, it will be taken from the configuration of webpack or rollup)          |
| indexPath       | String                                               | No        | `staticDir/index.html`    | The index file to fall back on for SPAs.                                                                                                                             |
| server          | Object                                               | No        | None                      | App server configuration options (See below)                                                                                                                         |
| renderer        | IRenderer Instance, constructor or String to require | No        | `new PuppeteerRenderer()` | The renderer you'd like to use to prerender the app. It's recommended that you specify this, but if not it will default to `@prerenderer/renderer-puppeteer`.        |
| rendererOptions | Object                                               | No        | None                      | The options to pass to the renderer if it was not given as an instance, see below for a list of options                                                              |
| postProcess     | (renderedRoute: Route, routes: Route[]) => void      | No        | None                      | Allows you to customize the HTML and output path before writing the rendered contents to a file, you can also add your own routes by pushing to the routes parameter |

#### Server Options

| Option     | Type     | Required? | Default                    | Description                                                                                                                                                                                                            |
| ---------- | -------- | --------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| port       | Integer  | No        | First free port after 8000 | The port for the app server to run on.                                                                                                                                                                                 |
| proxy      | Object   | No        | No proxying                | Proxy configuration. Has the same signature as [webpack-dev-server](https://webpack.js.org/configuration/dev-server/#devserver-proxy)                                                                                  |
| host       | String   | No        | 127.0.0.1                  | The host to send requests to. Use with caution, as changing this could result in external urls being rendered instead of your local server, use `postProcess` if you just want to change urls in the resulting `.html` |
| listenHost | String   | No        | 127.0.0.1                  | The ip address the server will listen to. (0.0.0.0 would allow external access, use with caution)                                                                                                                      |
| ~~before~~ | Function | No        | No operation               | Deprecated: Use `hookServer()` instead. Function for adding custom server middleware.                                                                                                                                  |

### Prerenderer Methods

- `constructor(options: Object)` - Creates a Prerenderer instance and sets up the renderer and server objects.
- `hookServer(cb: (server: Express) => void, stage: Stage = 'pre-fallback')` - Use this method to hook into the express server to add middlewares, routes etc
- `initialize(): Promise<void>` - Starts the static file server and renderer instance (where appropriate).
- `getOptions(): PrerenderFinalOptions` - Returns the options used to configure `prerenderer`
- `getServer(): Server` - Returns the Server class holding the express server
- `destroy(): Promise<void>` - Destroys the static file server and renderer, freeing the resources.
- `renderRoutes(routes: Array<String>): Promise<Array<RenderedRoute>>` - Renders set of routes. Returns a promise
  resolving to an array of rendered routes in the form of:

```js
[
  {
    originalRoute: '/route/path', // The requested route path.
    route: '/route/redirected-path', // The final route path after redirection or history change.
    html: '<!DOCTYPE html><html>...</html>', // The prerendered HTML for the route
  },
  // ...
];
```

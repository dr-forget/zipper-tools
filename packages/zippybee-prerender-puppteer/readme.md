### `@prerenderer/renderer-puppeteer` Options

None of the options are required, by default the page will render when puppeteer is ready which is when DOMContentLoaded fires

| Option                   | Type                                                                                                                                       | Default                | Description                                                                                                                                                                                                                                                          |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| maxConcurrentRoutes      | Number                                                                                                                                     | 0 (No limit)           | The number of routes allowed to be rendered at the same time. Useful for breaking down massive batches of routes into smaller chunks.                                                                                                                                |
| inject                   | Object                                                                                                                                     | None                   | An object to inject into the global scope of the rendered page before it finishes loading. Must be `JSON.stringifiy`-able. The property injected to is `window['__PRERENDER_INJECTED']` by default.                                                                  |
| injectProperty           | String                                                                                                                                     | `__PRERENDER_INJECTED` | The property to mount `inject` to during rendering. Does nothing if `inject` isn't set.                                                                                                                                                                              |
| renderAfterDocumentEvent | String                                                                                                                                     | DOMContentLoaded       | Wait to render until the specified event is fired on the document. (You can fire an event like so: `document.dispatchEvent(new Event('custom-render-trigger'))`                                                                                                      |
| renderAfterTime          | Integer (Milliseconds)                                                                                                                     | None                   | Wait to render until a certain amount of time has passed.                                                                                                                                                                                                            |
| renderAfterElementExists | String (Selector)                                                                                                                          | None                   | Wait to render until the specified element is detected using `document.querySelector`                                                                                                                                                                                |
| elementVisible           | Boolean                                                                                                                                    | None                   | If we should wait until the `renderAfterElementExists` is visible                                                                                                                                                                                                      |
| elementHidden            | Boolean                                                                                                                                    | None                   | If we should wait until the `renderAfterElementExists` is hidden                                                                                                                                                                                                      |
| timeout                  | Integer (Milliseconds)                                                                                                                     | 30000                  | If this timeout triggers while waiting for an event or an element, the rendering will abort with an error.                                                                                                                                                           |
| skipThirdPartyRequests   | Boolean                                                                                                                                    | `false`                | Automatically block any third-party requests. (This can make your pages load faster by not loading non-essential scripts, styles, or fonts.)                                                                                                                         |
| headless                 | Boolean                                                                                                                                    | `true`                 | Whether to run the browser in headless mode                                                                                                                                                                                                                          |
| consoleHandler           | function(route: String, message: [ConsoleMessage](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-consolemessage)) | None                   | Allows you to provide a custom console.* handler for pages. Argument one to your function is the route being rendered, argument two is the [Puppeteer ConsoleMessage](https://github.com/puppeteer/puppeteer/blob/main/docs/api/puppeteer.consolemessage.md) object. |
| viewport                 | [Viewport](https://github.com/puppeteer/puppeteer/blob/main/docs/api/puppeteer.viewport.md)                                                | None                   | Those options will be passed to `puppeteer.launch()`.                                                                                                                                                                                                                |
| launchOptions            | [LaunchOptions](https://github.com/puppeteer/puppeteer/blob/main/docs/api/puppeteer.launchoptions.md)                                      | None                   | Those options will be passed to `puppeteer.launch()`.                                                                                                                                                                                                                |
| navigationOptions        | [WaitForOptions](https://github.com/puppeteer/puppeteer/blob/main/docs/api/puppeteer.waitforoptions.md)                                    | None                   | Those options will be passed to `page.goto()`, such as `timeout: 30000ms`.                                                                                                                                                                                           |

---


## Caveats

- For obvious reasons, `prerenderer` only works for SPAs that route using the HTML5 history
  API. `index.html#/hash/route` URLs will unfortunately not work.
- Whatever client-side rendering library you're using should be able to at least replace any server-rendered content or
  diff with it.
  - For **Vue.js 1** use [`replace: false`](http://vuejs.org/api/#replace) on root components.
  - For **Vue.js 2 and 3**  Ensure your root component has the same id as the prerendered element it's replacing. Otherwise
    you'll end up with duplicated content.

## Contributing

This is a monorepo, using `pnpm`, so you'll need to clone the repository, then run `pnpm install` inside the directory

Run `npm run test` to make sure that everything is working correctly

## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/tribex">
          <img width="150" height="150" src="https://github.com/tofandel.png?v=3&s=150">
          </br>
          Adrien Foulon
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/tribex">
          <img width="150" height="150" src="https://github.com/JoshTheDerf.png?v=3&s=150">
          </br>
          Joshua Bemenderfer
        </a>
      </td>
    </tr>
  <tbody>
</table>

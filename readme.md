# zippybee-CLI

zippybee-CLI is a command-line interface tool developed based on Vite 5.0. It allows for rapid setup of project architectures supporting Vue 3, React, and more, out-of-the-box without requiring extensive configuration.

- 💡 支持项目多环境配置
- 🛠️ 构建打包的依赖分析
- 📦  低版本浏览器的自动兼容
- 🔩  构建产物的模块的 CDN 引入
- 🔑  更多模块持续更新

## Installation

### Using npm

```bash
npm i @zippybee/cli -g
```

### Using pnpm

```bash
pnpm install @zippybee/cli -g
```

## Usage

###  Scaffold a Project

To scaffold a Vite + Vue project:

```bash
zippybee create --vue  #vue
```

To scaffold a Vite + React project:

```bash
zippy create --react #react
```

## Run Development Server

```bash
npm run dev
```



## CLI Commands



| Command           | Types              | Default         | Description                             |
| ----------------- | ------------------ | --------------- | --------------------------------------- |
| `-v` or `version` | `string`           | `1.0.0`         | Check version number                    |
| `server`          |                    |                 | Run the project                         |
|                   | `-p` or `port`     | `string`        | port is default (8001)                  |
|                   | `-e` or `env`      | `string`        | Set environment variables(default:dev)  |
|                   | `-n` or `NODE_ENV` | `string`        | Specify NODE_ENV (default: development) |
| `build`           |                    |                 | Build the project                       |
|                   | `-e` or `env`      | `string`        | Set environment variables(default:prod) |
|                   | `-o`               | `string`        | output directory (default: dist)        |
| `preview`         |                    |                 | Preview Build Product                   |
|                   | `-p` or `port`     | `string|number` | port is default (7001)                  |
|                   | `--open`           | `bool`          | Open browser automatically              |



## Custom Configuration

Create a `zippy.config.mjs` configuration file in the root directory supporting TypeScript (ts) and ECMAScript modules (mjs). The CLI only supports configuration files following ECMAScript standards due to its reliance on Vite 5.0, which will eventually deprecate CommonJS (cjs) APIs.



### Configuration Options



| Option                                                       | Types                                                        | Default      | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------ | ------------------------------------------------------------ |
| `vueIsJsx`                                                   | `bool`                                                       | `false`      | Enable JSX support in Vue mode                               |
| `analyzeDependencies`                                        | `object`                                                     |              | Dependency analysis configuration                            |
|                                                              | `enable:bool`                                                | `false`      | - `enable`: Enable dependency analysis                       |
|                                                              | `open:bool`                                                  | `false`      | - `open`: Automatically open the analysis panel              |
| `polyfill`                                                   | `object`                                                     |              | Configuration for compatibility with older browsers          |
|                                                              | `enable:bool`                                                | `false`      | - `enable`: Enable compatibility with older versions         |
|                                                              | `targets:string[]`                                           | `['ie>=11']` | - `targets`: Target browser versions                         |
| `html_plugin`                                                | `object`                                                     |              | HTML injection configuration                                 |
| [插件文档地址](https://github.com/dr-forget/zippybee-tools/tree/master/packages/zippybee-plugin-html#readme) | `enable:bool`                                                | `false`      | - `enable`: Enable HTML injection                            |
|                                                              | `template:string`                                            | `index.html` | - `template`: HTML template entry                            |
|                                                              | `injectData:object`                                          | `{}`         | - `injectData`: Data to be injected                          |
|                                                              | `config`                                                     | {}           |                                                              |
|                                                              | `config.commonfileName`                                      | `string`     | Common Profile Name                                          |
|                                                              | `config.ignorefileName`                                      | `string`     | local file name                                              |
| `package_cdn`                                                | `object`                                                     |              | Module CDN import                                            |
|                                                              | `modules:string[]|Module[]`                                  | `[]`         | - `modules`: Modules to import                               |
|                                                              | `cdnUrl:string`                                              | `""`         | - `cdnUrl`: CDN address for imported modules                 |
| `isAutoComponent`                                            | `object`                                                     | `{}`         | Automatic on-demand import of component libraries            |
| [文档地址](https://github.com/unplugin/unplugin-vue-components/blob/main/README.md) | `dts:bool`                                                   | `false`      | Do I need to generate typescript declaration files           |
|                                                              | `dirs:string[]`                                              | `[]`         | Folders for automatic component import                       |
|                                                              | `resolvers:ComponentResolver|ComponentResolver[]`            | `[]`         | Third-party Component Library                                |
|                                                              | resolvers：说明                                              |              | 可从@zipplybee/cli 引入 示例：<br /> import {AntDesignVueResolver} from "@zippubee/cli/resolves"  [支持该插件的所有resolves](https://github.com/unplugin/unplugin-vue-components/blob/main/README.md) 基于该插件二次开发维护 |
| `custom_vite_config`                                         | ```({mode,env,isPreview,isSSR})=>UserConfig|Promise<UserConfig>``` | `()=>{}`     | Custom Vite configuration                                    |
|                                                              | `vite->UserConfig`                                           |              | - Integrates the Vite UserConfig                             |

### Migration from existing projects

基于cli 内置了一些插件 从原有的项目迁移到@zippybee/cli  您需要操作以下几个步骤

1. 新建zippy.config.ts or zippy.config.mjs  与原来vite.config.ts|vite.config.js 的融合

###    插件内置插件

1.    Vuejsx    vuejsx的支持   配置为true即可

2.  rollup-plugin-visualizer  构建依赖分析  根据Configuration 配置即可 自动开启

3. polyfill   打包构建添加浏览器兼容

4. html_plugin  类似与webpack-html-plugin 模板注入  Configuration配置true 则自动会往模板注入`<%- injectScript %>`ejs变量您也可以在`injectData`覆盖它

   ### 1.injectScript

   开启html_plugin时 依赖环境变量 同时会注入环境变量信息 挂载window上 供全局使用 

   示例:package.json 

   ```
   "script":{
    		"dev":"zippy server -e dev"
   }
   // 如果开去html_plugin 则会干下面几件事情
   //1.会读取config文件夹下 对应环境变量的json文件 
   npm run dev  //则自动读取config/dev.json  环境变量请与文件名保持一致
   //如在html_plugin Configuration 配置config 会有commonfileName ignorefileName 进行合并
   //内部工作流程
   //comm.json merge dev.json merge ignore.json   
   //ignore.json 具有最高配置权限 (一般用于多人协作 ，本地开发  不用于提交Git的配置文件)
   
   ```

   

5. package_cdn  构建第三方包时自动引用cdn版本    例如:zippyer.config.ts

   ```
   package_cdn:{
   		modules:['vue']
   },
   //构建时将以cdn的引入vue  则不参与实际打包  cdn地址 https://cdn.jsdelivr.net/npm/{name}@{version}/{path}
   //您也可以按照此格式配置cdnUrl地址
   ```

   

6. isAutoComponent vue开发时自动引入组件 省去import 示例：zippy.config.ts

   ```
   import { AntDesignVueResolver } from '@zippybee/cli/resolves';
   isAutoComponent:{
     dts:false, //ts开发时 开启 自动注入引入组件的声明文件
     dirs:[],//需要自动导入组件的文件夹名 例如 src/components
     resolvers:[AntDesignVueResolver({
     importstyle:false
     })],//第三方UI框架的引入模块  
   }
   //@zippybee/cli/resolves 内置第三方UI模块加载器 具体支持第三方UI框架加载详见：https://github.com/unplugin/unplugin-vue-components/blob/main/README.md
   ```

7. 基于cli的拓展性 业务的复杂多样性 cli 提供了custom_vite_config 接口 用户特定的vite配置 该接口完全继承vite.config.js or vite.config.ts  您甚至可以不做改动 直接将vite.config 直接粘贴与此 就可以运行项目  但是不建议这么做 

   ```
   custom_vite_config:({mode,command,env,isSsrBuild,isPreview})=>vite.config
   ```

8. 由于cli 采用es规范开发 vite在后续版本也都采用es规范 废弃cjs node Api  相关配置文件 不再支持 cjs规范 请使用es规范

### License

This project is licensed under the [License Name] - see the LICENSE file for details.


This Markdown document outlines the zippybee-CLI tool, including installation, usage, CLI commands, custom configuration options in a tabular format, guidelines for contributing, and licensing information. Adjust the placeholders like `[License Name]`, `[link-to-issues]`, and `[link-to-license-file]` with appropriate details.


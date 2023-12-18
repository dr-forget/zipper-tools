# Tiger-CLI

Tiger-CLI is a command-line interface tool developed based on Vite 5.0. It allows for rapid setup of project architectures supporting Vue 3, React, and more, out-of-the-box without requiring extensive configuration.

## Installation

### Using npm

```bash
npm i @tiger-cli -g
```

### Using pnpm

```bash
pnpm install @tiger-cli -g
```

### Usage

##Scaffold a Project

To scaffold a Vite + Vue project:

```bash
tiger-cli create --vue  #vue
```

To scaffold a Vite + React project:

```bash
tiger-cli create --react #react
```

## Run Development Server

```bash
npm run dev
```

### CLI Commands

## CLI Commands

| Command                | Description                                          |
|------------------------|------------------------------------------------------|
| `-v` or `version`      | Check version number                                 |
| `server`               | Run the project                                      |
| `-p` or `port`         | Set the port                                         |
| `-e` or `environment`  | Set environment variables                            |
| `-n` or `NODE_ENV`     | Specify NODE_ENV (default: development)               |
| `build`                | Build the project                                    |
| `create`               | Create a project                                     |
|                        | - `--vue vue`: Vue template                          |
|                        | - `--react react`: React template                    |


## Custom Configuration

Create a `tiger-cli` configuration file in the root directory supporting TypeScript (ts) and ECMAScript modules (mjs). The CLI only supports configuration files following ECMAScript standards due to its reliance on Vite 5.0, which will eventually deprecate CommonJS (cjs) APIs.

### Configuration Options

| Option                  | Description                                         |
|-------------------------|-----------------------------------------------------|
| `vueIsJsx`              | Enable JSX support in Vue mode                       |
| `analyzeDependencies`   | Dependency analysis configuration                   |
|                         | - `enable`: Enable dependency analysis              |
|                         | - `open`: Automatically open the analysis panel     |
| `polyfill`              | Configuration for compatibility with older browsers |
|                         | - `enable`: Enable compatibility with older versions|
|                         | - `targets`: Target browser versions                |
| `html_plugin`           | HTML injection configuration                        |
|                         | - `enable`: Enable HTML injection                   |
|                         | - `template`: HTML template entry                  |
|                         | - `injectData`: Data to be injected                 |
| `package_cdn`           | Module CDN import                                   |
|                         | - `modules`: Modules to import                     |
|                         | - `cdnUrl`: CDN address for imported modules        |
| `custom_vite_config`    | Custom Vite configuration                           |
|                         | - Integrates the Vite UserConfig                    |



### License
This project is licensed under the [License Name] - see the LICENSE file for details.


This Markdown document outlines the Tiger-CLI tool, including installation, usage, CLI commands, custom configuration options in a tabular format, guidelines for contributing, and licensing information. Adjust the placeholders like `[License Name]`, `[link-to-issues]`, and `[link-to-license-file]` with appropriate details.


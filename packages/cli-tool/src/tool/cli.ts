import path from 'path';
import fs from 'fs';
import { Command } from 'commander';
import { Service } from '../service';
import { isRunCli } from './tool';
import { fileURLToPath } from 'url';

const program = new Command();
program.version('1.0.0', '-V --version').usage('<command> [options]');

program
  .command('server')
  .description('serve your project in development mode')
  .option('-p, --port <port>', 'port used by the server (default: 8001)')
  .option('-e, --env <env>', 'env used by the server (default: dev)')
  .option('-n, --NODE_ENV <NODE_ENV>', 'env used by the server (default: development)')
  .action(async (cmd) => {
    // 判断cli是否能运行该项目
    const isRun = isRunCli();
    if (!isRun) return;
    // 共享全局env
    const env_obj = {
      backend_env: cmd.env || 'dev',
      port: cmd.port || 8001,
      stack: isRun,
    };
    process.env.NODE_ENV = cmd.NODE_ENV || 'development';
    process.env.tigercli_env = JSON.stringify(env_obj);
    new Service().start();
  });

program
  .command('build [root]')
  .description('build for production')
  .option('-e, --env <env>', 'env used by the server (default: prod)')
  .option('-n, --NODE_ENV <NODE_ENV>', 'env used by the server (default: production)')
  .option('-t, --target <target>', `[string] transpile target (default: 'modules')`)
  .option('-o, --outDir <dir>', `[string] output directory (default: dist)`)
  .action(async (root, cmd) => {
    // 技术栈
    // 判断cli是否能运行该项目
    const isRun = isRunCli();
    if (!isRun) return;
    const root_path = path.resolve(process.cwd(), root || '');
    const output_path = path.resolve(process.cwd(), cmd.outDir || 'dist');
    if (!fs.statSync(root_path)) {
      console.log('项目目录不存在');
      return;
    }
    // 共享全局env
    const env_obj = {
      backend_env: cmd.env || 'dev',
      port: cmd.port || 8001,
      stack: isRun,
      root_path,
      target: cmd.target || 'modules',
      output_path: output_path,
    };
    process.env.NODE_ENV = cmd.NODE_ENV || 'production';
    process.env.tigercli_env = JSON.stringify(env_obj);
    new Service().build();
  });

program
  .command('preview [root]')
  .description('preview for production')
  .option('-o, --outDir <dir>', `[string] output directory (default: dist)`)
  .action(async (root, cmd) => {
    if (cmd.outDir) {
      const output_path = path.resolve(process.cwd(), cmd.outDir || 'dist');
      if (!fs.existsSync(output_path)) {
        console.log('目录不存在');
        return;
      }
      new Service().preview('server', output_path);
      return;
    }
    new Service().preview('cli');
  });
program.parse(process.argv);
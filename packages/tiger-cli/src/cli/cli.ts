import { Command } from "commander";
import { Service } from "../service";
import { getTechnologyStack } from "./tool";
import chalk from "chalk";

const program = new Command();
program.version("1.0.0", "-V --version").usage("<command> [options]");

program
  .command("server")
  .description("serve your project in development mode")
  .option("-p, --port <port>", "port used by the server (default: 8001)")
  .option("-e, --env <env>", "env used by the server (default: dev)")
  .option(
    "-n, --NODE_ENV <NODE_ENV>",
    "env used by the server (default: development)"
  )
  .action(async (cmd) => {
    // 技术栈
    const stack = getTechnologyStack();
    console.log(stack, "当前技术栈");
    if (!stack) {
      console.log(chalk.red("暂不支持的技术栈,当前仅支持['vue','react']"));
      return;
    }
    console.log(chalk.green("current technology stack is " + stack));
    // 共享全局env
    const env_obj = {
      backend_env: cmd.env || "dev",
      port: cmd.port || 8001,
      stack: stack,
    };
    process.env.NODE_ENV = cmd.NODE_ENV || "development";
    process.env.tigercli_env = JSON.stringify(env_obj);
    new Service().start();
  });

program.parse(process.argv);

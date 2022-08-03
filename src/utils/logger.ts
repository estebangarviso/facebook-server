import logger from 'loglevel';
import chalk from 'chalk';

export class Logger {
  static log(message: any) {
    // logger.info(chalk.green(`[app] 🪵 `, message));
    console.log(chalk.green(`[app] 🪵 `, message));
  }

  static error(message: any) {
    // logger.error(chalk.red(`[app] 🚨 `, message));
    console.error(chalk.red(`[app] 🚨 `, message));
  }

  static success(message: any) {
    // logger.info(chalk.green(`[app] 🎉 `, message));
    console.log(chalk.green(`[app] 🎉 `, message));
  }

  static warn(message: any) {
    // logger.warn(chalk.yellow(`[app] ⚠️ `, message));
    console.warn(chalk.yellow(`[app] ⚠️ `, message));
  }

  static debug(message: any) {
    // logger.debug(chalk.blue(`[app] 🐛 `, message));
    console.debug(chalk.blue(`[app] 🐛 `, message));
  }
}

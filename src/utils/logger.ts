import logger from 'loglevel';
import chalk from 'chalk';

export class Logger {
  static info(message: any) {
    logger.info(chalk.cyan(`[app] 💬`, message));
  }
  static log(message: any) {
    logger.info(chalk.green(`[app] 🪵`, message));
  }

  static error(message: any) {
    logger.error(chalk.red(`[app] 🔴`, message));
  }

  static success(message: any) {
    logger.info(chalk.greenBright(`[app] 🟢`, message));
  }

  static warn(message: any) {
    logger.warn(chalk.yellow(`[app] 🟡`, message));
  }

  static debug(message: any) {
    logger.debug(chalk.blue(`[app] 🐛`, message));
  }
}

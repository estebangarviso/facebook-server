/* eslint-disable unicorn/import-style */
import chalk from 'chalk';
import util from 'util';
import logger, { LogLevelDesc } from 'loglevel';
import { TableUserConfig, table } from 'table';
import { Injectable } from '@core/decorators';

@Injectable()
export class Logger {
	public static log(...args: any[]) {
		logger.log(
			chalk.green('[app] 🪵'),
			...args.map((param) =>
				typeof param === 'object'
					? chalk.green(
							util.inspect(param, { colors: true, depth: null })
					  )
					: chalk.green(param)
			)
		);
		chalk.reset();
	}

	public static info(...args: any[]) {
		logger.info(
			chalk.blueBright('[app] 💬'),
			...args.map((param) =>
				typeof param === 'object'
					? chalk.blueBright(
							util.inspect(param, { colors: true, depth: null })
					  )
					: chalk.blueBright(param)
			)
		);
		chalk.reset();
	}

	public static error(...args: any[]) {
		logger.error(
			chalk.red('[app] 🔴'),
			...args.map((param) =>
				typeof param === 'object'
					? chalk.red(
							util.inspect(param, { colors: true, depth: null })
					  )
					: chalk.red(param)
			)
		);
		chalk.reset();
	}

	public static success(...args: any[]) {
		logger.info(
			chalk.greenBright('[app] 🟢'),
			...args.map((param) =>
				typeof param === 'object'
					? chalk.greenBright(
							util.inspect(param, { colors: true, depth: null })
					  )
					: chalk.greenBright(param)
			)
		);
		chalk.reset();
	}

	public static warn(...args: any[]) {
		logger.warn(
			chalk.yellow('[app] 🟡'),
			...args.map((param) =>
				typeof param === 'object'
					? chalk.yellow(
							util.inspect(param, { colors: true, depth: null })
					  )
					: chalk.yellow(param)
			)
		);
		chalk.reset();
	}

	public static debug(...args: any[]) {
		// eslint-disable-next-line unicorn/error-message
		const stack = new Error().stack;
		const callers = stack?.split('at ');
		let traceString = '';
		if (callers && callers.length > 2) {
			for (
				let i = 2;
				i < callers.length;
				i++ // exclude node_modules
			) {
				if (!callers[i].includes('node_modules'))
					traceString += `\r    at ${callers[i]}`;
			}
		}
		logger.debug(
			chalk.magenta('[app] 🟣'),
			...args.map((param) =>
				typeof param === 'object'
					? chalk.magenta(
							util.inspect(param, { colors: true, depth: null })
					  )
					: chalk.magenta(param)
			),
			chalk.magenta(`\n${traceString}`)
		);
		chalk.reset();
	}

	public static table(data: unknown[][], config?: TableUserConfig) {
		data[0] = data[0].map((item) => chalk.bold.underline(item));

		const styledConfig = Object.assign(
			{},
			config,
			config?.header?.content && {
				header: {
					content: chalk.bold.underline(config.header.content)
				}
			}
		);

		logger.log(chalk.cyan(table(data, styledConfig)));
		chalk.reset();
	}

	public log(...args: any[]) {
		Logger.log(...args);
	}

	public info(...args: any[]) {
		Logger.info(...args);
	}

	public error(...args: any[]) {
		Logger.error(...args);
	}

	public success(...args: any[]) {
		Logger.success(...args);
	}

	public warn(...args: any[]) {
		Logger.warn(...args);
	}

	public debug(...args: any[]) {
		Logger.debug(...args);
	}

	public table(data: unknown[][], config?: TableUserConfig) {
		Logger.table(data, config);
	}

	public static getLevel() {
		return logger.getLevel();
	}

	public static setLevel(level: LogLevelDesc) {
		logger.setLevel(level);
	}

	public static enableAll() {
		logger.enableAll();
	}
}

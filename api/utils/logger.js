"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    static info(message) {
        console.info(chalk_1.default.blue(`[app] 💬 `, message));
    }
    static log(message) {
        // logger.info(chalk.green(`[app] 🪵 `, message));
        console.log(chalk_1.default.green(`[app] 🪵 `, message));
    }
    static error(message) {
        // logger.error(chalk.red(`[app] 🚨 `, message));
        console.error(chalk_1.default.red(`[app] 🚨 `, message));
    }
    static success(message) {
        // logger.info(chalk.green(`[app] 🎉 `, message));
        console.log(chalk_1.default.green(`[app] 🎉 `, message));
    }
    static warn(message) {
        // logger.warn(chalk.yellow(`[app] ⚠️ `, message));
        console.warn(chalk_1.default.yellow(`[app] ⚠️ `, message));
    }
    static debug(message) {
        // logger.debug(chalk.blue(`[app] 🐛 `, message));
        console.debug(chalk_1.default.blue(`[app] 🐛 `, message));
    }
}
exports.Logger = Logger;

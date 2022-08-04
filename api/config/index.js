"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGE_SIZES = exports.WEBSOCKET_SERVER_KEY = exports.WEBSOCKET_SERVER_URL = exports.SALT_WORK_FACTOR = exports.SKIP_VALIDATION = exports.DB_NAME = exports.DB_URI = exports.FRONTEND_ORIGIN = exports.PORT = exports.ACCESS_TOKEN_EXPIRES_IN = exports.ACCESS_TOKEN_SECRET = exports.PUBLIC_DIR = exports.MAINTENANCE_MODE = void 0;
const dotenv_1 = require("dotenv");
const utils_1 = require("../utils");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)();
exports.MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true';
exports.PUBLIC_DIR = path_1.default.join(__dirname, '../../public');
exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
exports.PORT = process.env.PORT;
exports.FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
exports.DB_URI = process.env.DB_URI;
exports.DB_NAME = process.env.DB_NAME;
exports.SKIP_VALIDATION = process.env.SKIP_VALIDATION === 'true';
exports.SALT_WORK_FACTOR = Number(process.env.SALT_WORK_FACTOR);
exports.WEBSOCKET_SERVER_URL = process.env.WEBSOCKET_SERVER_URL;
exports.WEBSOCKET_SERVER_KEY = process.env.WEBSOCKET_SERVER_KEY;
exports.PAGE_SIZES = JSON.parse(process.env.PAGE_SIZES);
exports.default = {
    verify: function () {
        if (typeof exports.MAINTENANCE_MODE !== 'boolean') {
            throw new Error('MAINTENANCE_MODE is not defined');
        }
        if (!exports.PUBLIC_DIR) {
            throw new Error('PUBLIC_DIR is not defined');
        }
        if (!exports.PORT) {
            throw new Error(`PORT is not defined`);
        }
        if (!exports.DB_URI) {
            throw new Error('DB_URI is not defined');
        }
        if (!exports.DB_NAME) {
            throw new Error('DB_NAME is not defined');
        }
        if (!exports.ACCESS_TOKEN_SECRET) {
            throw new Error('ACCESS_TOKEN_SECRET is not defined');
        }
        if (!exports.ACCESS_TOKEN_EXPIRES_IN) {
            throw new Error('ACCESS_TOKEN_EXPIRES_IN is not defined');
        }
        if (!exports.FRONTEND_ORIGIN) {
            throw new Error('FRONTEND_ORIGIN is not defined');
        }
        if (typeof exports.SKIP_VALIDATION !== 'boolean') {
            throw new Error('SKIP_VALIDATION is not defined');
        }
        if (exports.SALT_WORK_FACTOR < 1) {
            throw new Error('SALT_WORK_FACTOR is not defined');
        }
        if (!exports.WEBSOCKET_SERVER_URL) {
            throw new Error('WEBSOCKET_SERVER_URL is not defined');
        }
        if (!exports.WEBSOCKET_SERVER_KEY) {
            throw new Error('WEBSOCKET_SERVER_KEY is not defined');
        }
        if (exports.PAGE_SIZES === undefined) {
            if (Object.keys(exports.PAGE_SIZES).length === 0) {
                throw new Error('PAGE_SIZES does not have any value');
            }
            throw new Error('PAGE_SIZES is not defined');
        }
        utils_1.Logger.success(`Environment variables are set correctly`);
    }
};

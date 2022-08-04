"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const utils_1 = require("../utils");
if (!config_1.DB_URI) {
    throw new Error('DB_URI is not defined');
}
if (!config_1.DB_NAME) {
    throw new Error('DB_NAME is not defined');
}
function connect(handleOpen) {
    utils_1.Logger.info(`Connecting to ${config_1.DB_NAME} database...`);
    mongoose_1.default.connect(`${config_1.DB_URI}`, {
        dbName: config_1.DB_NAME,
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const connection = mongoose_1.default.connection;
    connection.on('error', utils_1.Logger.error.bind(utils_1.Logger, 'MongoDB connection error:'));
    connection.on('disconnected', connect);
    connection.once('open', () => {
        utils_1.Logger.success(`MongoDB connected to ${config_1.DB_NAME}`);
        if (handleOpen) {
            handleOpen();
        }
    });
    return connection;
}
exports.default = connect;

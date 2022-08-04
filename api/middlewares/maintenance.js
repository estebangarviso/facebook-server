"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const maintenance = (req, res, next) => {
    if (config_1.MAINTENANCE_MODE) {
        return res.status(503).json({
            message: 'Service unavailable, please try again later'
        });
    }
    next();
};
exports.default = maintenance;

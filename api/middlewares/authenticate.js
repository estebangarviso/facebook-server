"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }
    //Decoding the token
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.ACCESS_TOKEN_SECRET);
        req.user = decoded.user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
};
exports.default = authenticate;

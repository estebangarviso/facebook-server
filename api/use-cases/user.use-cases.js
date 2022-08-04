"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const config_1 = require("../config");
const utils_1 = require("../utils");
const authenticate = async (req, res) => {
    const body = req.body;
    try {
        const user = await models_1.User.findOne({ email: body.email });
        if (user) {
            let response;
            user.comparePassword(body.password, (_err, isMatch) => {
                if (_err)
                    throw _err;
                if (isMatch) {
                    const token = jsonwebtoken_1.default.sign({
                        user: (0, utils_1.userPayload)(user)
                    }, config_1.ACCESS_TOKEN_SECRET, { expiresIn: config_1.ACCESS_TOKEN_EXPIRES_IN });
                    utils_1.Logger.log(`User ${user.fullname} logged in`);
                    response = res.status(200).json({
                        success: true,
                        token
                    });
                }
                else {
                    response = res.status(401).json({
                        message: 'Invalid password'
                    });
                }
            });
            return response;
        }
        return res.status(400).json({
            message: 'Invalid email or password'
        });
    }
    catch (error) {
        utils_1.Logger.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};
const register = async (req, res) => {
    const body = req.body;
    const files = req.files;
    try {
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        let avatar = files?.avatar;
        const fileName = `${Date.now()}-${avatar?.name}`;
        if (avatar) {
            body.avatar = '/uploads/avatars/' + fileName;
        }
        else {
            body.avatar = null;
        }
        const user = new models_1.User({
            name: {
                first: body.firstName,
                last: body.lastName
            },
            email: body.email,
            password: body.password,
            avatar: body.avatar
        });
        await user.save();
        // then move the file to the uploads folder
        if (avatar) {
            avatar.mv(config_1.PUBLIC_DIR + '/uploads/avatars/' + fileName);
        }
        utils_1.Logger.log(`User ${user.name.first} ${user.name.last} registered`);
        return res.status(200).json({
            success: true,
            message: `User ${body.email} created`
        });
    }
    catch (error) {
        if (error.message.includes('E11000')) {
            return res.status(400).json({
                message: `User with email ${body.email} already exists`
            });
        }
        return res.status(400).json({
            message: error.message
        });
    }
};
const refresh = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.ACCESS_TOKEN_SECRET);
        utils_1.Logger.log(`User ${decoded.user.fullname} refreshed token`);
        const userId = decoded.user._id;
        const user = await models_1.User.findById(userId);
        if (!user) {
            return res.status(401).json({
                message: 'User not found from token'
            });
        }
        const _token = jsonwebtoken_1.default.sign({
            user: (0, utils_1.userPayload)(user)
        }, config_1.ACCESS_TOKEN_SECRET, {
            expiresIn: config_1.ACCESS_TOKEN_EXPIRES_IN
        });
        return res.status(200).json({
            success: true,
            token: _token
        });
    }
    catch (error) {
        utils_1.Logger.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
};
const logout = (req, res) => {
    // remove token from cookies if it exists and from jwt
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'No token provided or token expired so just logged out from the app'
            });
        }
        // clean cookie token from browser
        res.clearCookie('token');
    }
    catch (error) {
        utils_1.Logger.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};
exports.default = {
    authenticate,
    register,
    refresh,
    logout
};

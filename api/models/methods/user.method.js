"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preSaveUser = void 0;
const config_1 = require("../../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchemaMethods = {
    skipValidation: function () {
        // !TODO: implement providers -> ~oAuthTypes.indexOf(this.provider); const oAuthTypes = ['github', 'twitter', 'google', 'linkedin'];
        return config_1.SKIP_VALIDATION;
    },
    comparePassword(candidatePassword, cb) {
        bcrypt_1.default.compare(candidatePassword, this.password, function (err, isMatch) {
            if (err)
                return cb(err);
            cb(null, isMatch);
        });
    }
};
const preSaveUser = function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt_1.default.genSalt(config_1.SALT_WORK_FACTOR, function (saltError, salt) {
            if (saltError) {
                return next(saltError);
            }
            else {
                bcrypt_1.default.hash(user.password, salt, function (hashError, hash) {
                    if (hashError) {
                        return next(hashError);
                    }
                    user.password = hash;
                    next();
                });
            }
        });
    }
    else {
        return next();
    }
};
exports.preSaveUser = preSaveUser;
exports.default = UserSchemaMethods;

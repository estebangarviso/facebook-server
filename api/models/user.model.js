"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const user_method_1 = __importStar(require("./methods/user.method"));
const user_validation_1 = __importDefault(require("./validations/user.validation"));
exports.UserSchema = new mongoose_1.Schema({
    avatar: {
        type: String,
        required: true,
        validate: {
            validator: (avatar) => {
                // @ts-ignore
                if (exports.UserSchema.methods.skipValidation())
                    return true;
                return user_validation_1.default.avatar(avatar);
            },
            message: 'File extension not allowed (only png, jpg, jpeg, gif)'
        }
    },
    name: {
        first: {
            type: String,
            required: true,
            validate: {
                validator: (firstName) => {
                    // @ts-ignore
                    if (exports.UserSchema.methods.skipValidation())
                        return true;
                    return user_validation_1.default.name(firstName);
                },
                message: 'First name must be at least 2 characters long'
            },
            trim: true
        },
        last: {
            type: String,
            required: true,
            validate: {
                validator: (lastName) => {
                    // @ts-ignore
                    if (exports.UserSchema.methods.skipValidation())
                        return true;
                    return user_validation_1.default.name(lastName);
                },
                message: 'Last name must be at least 2 characters long'
            },
            trim: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => {
                // @ts-ignore
                if (exports.UserSchema.methods.skipValidation())
                    return true;
                return user_validation_1.default.email(email);
            },
            message: 'Email is not valid'
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (password) => {
                // @ts-ignore
                if (exports.UserSchema.methods.skipValidation())
                    return true;
                return user_validation_1.default.password(password);
            },
            message: 'Password must be at least 8 characters long, contain at least one number, one uppercase letter and one special character (@$!%*?&)'
        }
    }
}, {
    timestamps: true,
    methods: user_method_1.default
});
/**
 * Virtuals
 */
exports.UserSchema.virtual('fullname').get(function () {
    return `${this.name.first} ${this.name.last}`;
});
exports.UserSchema.pre('save', user_method_1.preSaveUser);
/**
 * Validations
 */
exports.User = (0, mongoose_1.model)('User', exports.UserSchema);

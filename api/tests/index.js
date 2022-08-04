"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const models_1 = require("./../models");
(0, db_1.default)();
models_1.User.find({})
    .then((users) => {
    console.log(users);
})
    .catch((err) => {
    console.log(err);
});

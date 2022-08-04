"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_use_cases_1 = __importDefault(require("../use-cases/user.use-cases"));
const router = express_1.default.Router();
router.post('/users/login', user_use_cases_1.default.authenticate);
router.post('/usersrefresh', user_use_cases_1.default.refresh);
router.post('/users/register', user_use_cases_1.default.register);
router.post('/users/logout', user_use_cases_1.default.logout);
exports.default = router;

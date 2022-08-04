"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const post_use_cases_1 = __importDefault(require("../use-cases/post.use-cases"));
const router = express_1.default.Router();
router.get('/posts', authenticate_1.default, post_use_cases_1.default.getAllPosts);
router.post('/posts', authenticate_1.default, post_use_cases_1.default.createPost);
router.post('/posts/:id/comments', authenticate_1.default, post_use_cases_1.default.createComment);
router.get('/posts/:id/comments', authenticate_1.default, post_use_cases_1.default.getAllComments);
router.delete('/posts/:id/comments/:commentId', authenticate_1.default, post_use_cases_1.default.deleteComment);
exports.default = router;

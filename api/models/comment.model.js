"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    post: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' },
    content: {
        type: String,
        required: true
    },
    replyTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment'
    }
}, {
    timestamps: true
});
exports.Comment = (0, mongoose_1.model)('Comment', CommentSchema);

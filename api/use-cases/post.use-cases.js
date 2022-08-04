"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./../models");
const utils_1 = require("./../utils");
const config_1 = require("../config");
const client_1 = __importDefault(require("../websocket-server/client"));
const getAllPosts = async (req, res) => {
    const pageNumber = Number(req.query.pageNumber) || 0;
    const pageSize = Number(req.query.pageSize) || config_1.PAGE_SIZES.posts;
    const posts = await models_1.Post.find({})
        // if we sort with -1 it will sort in descending order and if we sort with 1 it will sort in ascending order
        .sort({ createdAt: -1 }) // !TODO: Bussiness logic with updatedAt
        .skip(pageNumber * pageSize)
        .limit(pageSize)
        .populate('user', 'avatar name');
    return res.status(200).json({
        posts,
        pageNumber,
        pageSize,
        hasMore: posts.length === pageSize
    });
};
const createPost = async (req, res) => {
    const user = req.user;
    const body = req.body;
    const files = req.files;
    body.user = user._id; // it comes from the token _id is userId
    let media = files?.media;
    try {
        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        if (media) {
            const fileName = `${body.user}-${Date.now()}-${media.name}`;
            media.mv(config_1.PUBLIC_DIR + '/uploads/posts/' + fileName);
            body.media = '/uploads/posts/' + fileName;
        }
        const post = new models_1.Post(body);
        await post.save().then(async (_post) => await _post.populate('user', 'avatar name'));
        (0, client_1.default)({
            data: {
                type: 'posts/postAdded',
                payload: post
            },
            clients: 'ALL'
        });
        return res.status(200).json({
            success: true,
            message: `Post created by user with email ${user.email}`
        });
    }
    catch (error) {
        return res.status(500).json({
            message: `Error creating post by user with email ${user.email}`
        });
    }
};
const deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await models_1.Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }
        if (post.user !== req.user.userId) {
            return res.status(401).json({
                message: 'You are not authorized to delete this post'
            });
        }
        models_1.Post.remove(postId);
        utils_1.Logger.log(`Post with id ${postId} deleted`);
        (0, client_1.default)({
            data: {
                type: 'posts/postDeleted',
                payload: postId
            },
            clients: 'ALL'
        });
        return res.status(200).json({
            success: true,
            message: `Post with id ${postId} deleted`
        });
    }
    catch (error) {
        return res.status(500).json({
            message: `Error deleting post with id ${postId}`
        });
    }
};
const createComment = async (req, res) => {
    const user = req.user;
    const body = req.body;
    const postId = req.params.id;
    try {
        const comment = new models_1.Comment({
            content: body.content,
            user: user._id,
            post: postId,
            replyTo: body.replyTo
        });
        await comment.save().then(async (_comment) => await _comment.populate('user', 'avatar name'));
        console.log('Log from createComment: ', comment);
        (0, client_1.default)({
            data: {
                type: 'comments/commentAdded',
                payload: comment
            },
            clients: 'ALL'
        });
        return res.status(200).json({
            success: true,
            message: `Comment created by user with email ${user.email}`
        });
    }
    catch (error) {
        return res.status(500).json({
            message: `Error creating comment by user with email ${user.email}`
        });
    }
};
/**
 * Use in '/post/:id/comment' route
 * @param req
 * @param res
 * @returns
 */
const getAllComments = async (req, res) => {
    const comments = await models_1.Comment.find({
        post: req.params.id
    })
        .populate('user', 'avatar name')
        .populate('replyTo');
    return res.status(200).json({ success: true, comments });
};
const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    try {
        const comment = await models_1.Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }
        if (comment.user !== req.user.userId) {
            return res.status(401).json({
                message: 'You are not authorized to delete this comment'
            });
        }
        models_1.Comment.remove(commentId);
        utils_1.Logger.log(`Comment with id ${commentId} deleted`);
        (0, client_1.default)({
            data: {
                type: 'comments/commentDeleted',
                payload: commentId
            },
            clients: 'ALL'
        });
        return res.status(200).json({
            success: true,
            message: `Comment with id ${commentId} deleted`
        });
    }
    catch (error) {
        return res.status(500).json({
            message: `Error deleting comment with id ${commentId}`
        });
    }
};
exports.default = {
    getAllPosts,
    createPost,
    createComment,
    getAllComments,
    deleteComment
};

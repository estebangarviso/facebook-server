import httpErrors from "http-errors";
import { Post, Comment } from "../database/mongo/models";
import { UploadedFile } from "express-fileupload";
import { Request, Response } from "express";
import { PUBLIC_DIR, PAGE_SIZES } from "~/config";
import sendWebSocketMessage from "~/websocket/sendWebSocketMessage";

const getAllPosts = async (req: Request, res: Response) => {
  const pageNumber = Number(req.query.pageNumber) || 0;
  const pageSize = Number(req.query.pageSize) || PAGE_SIZES.posts;
  const posts = await Post.find({})
    .sort({
      createAt: -1,
      updatedAt: -1,
      __v: -1,
    })
    .skip(pageNumber * pageSize)
    .limit(pageSize)
    .populate("user", "avatar name");
  return res.status(200).json({
    posts,
    pageNumber,
    pageSize,
    hasMore: posts.length === pageSize,
  });
};

const createPost = async (req: Request, res: Response) => {
  const user = req.user;
  const body = req.body;
  const files = req.files;

  body.user = user._id; // it comes from the token _id is userId
  const media = files?.media as UploadedFile;
  try {
    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    if (media) {
      const fileName = `${body.user}-${Date.now()}-${media.name}`;
      media.mv(PUBLIC_DIR + "/uploads/posts/" + fileName);
      body.media = "/uploads/posts/" + fileName;
    }

    const post = new Post(body);
    await post
      .save()
      .then(async (_post) => await _post.populate("user", "avatar name"));
    sendWebSocketMessage({
      type: "posts/postAdded",
      payload: post,
    });
    return res.status(200).json({
      success: true,
      message: `Post created by user with email ${user.email}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error creating post by user with email ${user.email}`,
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    if (post.user !== req.user.userId) {
      return res.status(401).json({
        message: "You are not authorized to delete this post",
      });
    }
    Post.remove(postId);
    sendWebSocketMessage({
      type: "posts/postDeleted",
      payload: postId,
    });
    return res.status(200).json({
      success: true,
      message: `Post with id ${postId} deleted`,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error deleting post with id ${postId}`,
    });
  }
};

const createComment = async (req: Request, res: Response) => {
  const user = req.user;
  const body = req.body;
  const postId = req.params.id;

  try {
    const comment = new Comment({
      content: body.content,
      user: user._id,
      post: postId,
      replyTo: body.replyTo,
    });
    await comment
      .save()
      .then(async (_comment) => await _comment.populate("user", "avatar name"));
    sendWebSocketMessage({
      type: "comments/commentAdded",
      payload: comment,
    });
    return res.status(200).json({
      success: true,
      message: `Comment created by user with email ${user.email}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error creating comment by user with email ${user.email}`,
    });
  }
};

/**
 * Use in '/post/:id/comment' route
 * @param req
 * @param res
 * @returns
 */
const getAllComments = async (req: Request, res: Response) => {
  const comments = await Comment.find({
    post: req.params.id,
  })
    .populate("user", "avatar name")
    .populate("replyTo");
  return res.status(200).json({ success: true, comments });
};

const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    if (comment.user !== req.user.userId) {
      return res.status(401).json({
        message: "You are not authorized to delete this comment",
      });
    }
    Comment.remove(commentId);
    sendWebSocketMessage({
      type: "comments/commentDeleted",
      payload: commentId,
    });
    return res.status(200).json({
      success: true,
      message: `Comment with id ${commentId} deleted`,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error deleting comment with id ${commentId}`,
    });
  }
};

export default {
  getAllPosts,
  createPost,
  deletePost,
  createComment,
  getAllComments,
  deleteComment,
};

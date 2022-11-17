import express from "express";
import isAuthenticated from "~/middlewares/isAuthenticated";
import PostUseCases from "~/use-cases/post.use-case";

const router = express.Router();
// Privatized routes
router.use(isAuthenticated);

router.get("/posts", PostUseCases.getAllPosts);
router.post("/posts", PostUseCases.createPost);
router.post("/posts/:id/comments", PostUseCases.createComment);
router.get("/posts/:id/comments", PostUseCases.getAllComments);
router.delete("/posts/:id/comments/:commentId", PostUseCases.deleteComment);

export default router;

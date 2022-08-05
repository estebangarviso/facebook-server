import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated';
import PostUseCases from '../use-cases/post.use-cases';

const router = express.Router();

router.get('/posts', isAuthenticated, PostUseCases.getAllPosts);
router.post('/posts', isAuthenticated, PostUseCases.createPost);
router.post('/posts/:id/comments', isAuthenticated, PostUseCases.createComment);
router.get('/posts/:id/comments', isAuthenticated, PostUseCases.getAllComments);
router.delete('/posts/:id/comments/:commentId', isAuthenticated, PostUseCases.deleteComment);

export default router;

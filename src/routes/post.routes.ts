import express from 'express';
import autheticate from '../middlewares/authenticate';
import PostUseCases from '../use-cases/post.use-cases';

const router = express.Router();

router.get('/posts', autheticate, PostUseCases.getAllPosts);
router.post('/posts', autheticate, PostUseCases.createPost);
router.post('/posts/:id/comments', autheticate, PostUseCases.createComment);
router.get('/posts/:id/comments', autheticate, PostUseCases.getAllComments);
router.delete('/posts/:id/comments/:commentId', autheticate, PostUseCases.deleteComment);

export default router;

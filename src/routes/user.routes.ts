import express from 'express';
import UserUseCases from '../use-cases/user.use-cases';

const router = express.Router();

router.post('/users/login', UserUseCases.authenticate);
router.post('/usersrefresh', UserUseCases.refresh);
router.post('/users/register', UserUseCases.register);
router.post('/users/logout', UserUseCases.logout);

export default router;

import express from "express";
import UserUseCases from "~/use-cases/user.use-case";

const router = express.Router();

router.post("/users/login", UserUseCases.authenticate);
router.post("/users/refresh", UserUseCases.refresh);
router.post("/users/register", UserUseCases.register);
router.post("/users/logout", UserUseCases.logout);

export default router;

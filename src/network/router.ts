import httpErrors from "http-errors";
import { Application, Response, Request, NextFunction } from "express";

import response from "./response";
import postRouter from "./routes/post.routes";
import userRouter from "./routes/user.routes";

const routers = [postRouter, userRouter];

const applyRoutes = (app: Application) => {
  routers.forEach((router) => app.use("/api", router));

  // Handling 404 error
  app.use((req, res, next) => {
    next(new httpErrors.NotFound("This route does not exists"));
  });
  // Middleware that handles errors
  app.use(
    (
      error: TypeError & { status: number },
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      console.error(error);
      response({
        message: error.message,
        res,
        status: error.status,
        error: true,
      });
      next();
    }
  );
};

export default applyRoutes;

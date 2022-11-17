import { Response } from "express";

type RouterResponseHandler = (args: {
  error: boolean;
  message: object | string | Response;
  status: number;
  res: Response;
}) => void;

const response: RouterResponseHandler = ({
  error = true,
  message = "Internal server error",
  status = 500,
  res,
}) => {
  console.debug("DEBUG: response", { error, message, status });

  res.status(status).send({ error, message });
};

export default response;

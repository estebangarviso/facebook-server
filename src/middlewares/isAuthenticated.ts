import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "~/config";
import httpErrors from "http-errors";

const isAuthenticated: RequestHandler = (req, res, next) => {
  const token =
    req.cookies.token || req.headers.authorization?.toString().split(" ")[1];

  if (!token) {
    throw new httpErrors.Unauthorized("No token provided");
  }

  //Decoding the token
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    req.user = decoded.user;

    next();
  } catch (error) {
    throw new httpErrors.Unauthorized("Invalid token");
  }
};

export default isAuthenticated;

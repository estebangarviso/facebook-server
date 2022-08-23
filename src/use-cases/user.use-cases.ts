import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  PUBLIC_DIR,
} from "../config";
import { UploadedFile } from "express-fileupload";
import { Logger } from "../utils";

const authenticate = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const user = await User.findOne({ email: body.email });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      let response;
      user.comparePassword(body.password, (_err: any, isMatch: boolean) => {
        if (_err) throw _err;
        if (isMatch) {
          const token = jwt.sign(
            {
              user: userWithoutPassword,
            },
            ACCESS_TOKEN_SECRET as string,
            { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
          );
          response = res.status(200).json({
            success: true,
            token,
          });
        } else {
          response = res.status(401).json({
            message: "Invalid password",
          });
        }
      });
      return response;
    }
    return res.status(400).json({
      message: "Invalid email or password",
    });
  } catch (error: any) {
    Logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const register = async (req: Request, res: Response) => {
  const body = req.body;
  const files = req.files;
  try {
    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    const avatar = files?.avatar as UploadedFile;
    const fileName = `${Date.now()}-${avatar?.name}`;
    if (avatar) {
      body.avatar = "/uploads/avatars/" + fileName;
    } else {
      body.avatar = null;
    }
    const user = new User({
      name: {
        first: body.first_name,
        last: body.last_name,
      },
      email: body.email,
      password: body.password,
      avatar: body.avatar,
    });
    await user.save();
    // then move the file to the uploads folder
    if (avatar) {
      avatar.mv(PUBLIC_DIR + "/uploads/avatars/" + fileName);
    }
    return res.status(200).json({
      success: true,
      message: `User ${body.email} created`,
    });
  } catch (error: any) {
    if (error.message.includes("E11000")) {
      return res.status(400).json({
        message: `User with email ${body.email} already exists`,
      });
    }
    return res.status(400).json({
      message: error.message,
    });
  }
};

const refresh = async (req: Request, res: Response) => {
  const token =
    req.cookies.token || req.headers.authorization?.toString().split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    const userId = decoded.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found from token",
      });
    }

    const { password, ...userWithoutPassword } = user;
    const _token = jwt.sign(
      {
        user: userWithoutPassword,
      },
      ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      }
    );
    return res.status(200).json({
      success: true,
      token: _token,
    });
  } catch (error: any) {
    Logger.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

const logout = (req: Request, res: Response) => {
  // remove token from cookies if it exists and from jwt
  try {
    const token =
      req.cookies.token || req.headers.authorization?.toString().split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message:
          "No token provided or token expired so just logged out from the app",
      });
    }
    // clean cookie token from browser
    res.clearCookie("token");
  } catch (error: any) {
    Logger.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export default {
  authenticate,
  register,
  refresh,
  logout,
};

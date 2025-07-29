import jwt, { type JwtPayload } from "jsonwebtoken";
import User, { type UserDoc } from "../models/user.model";
import { type NextFunction, type Request, type Response } from "express";

export interface ReqWithUser extends Request {
  user: UserDoc;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded)
      return res.status(401).json({
        message: "Unauthorized - Invalid token",
      });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    (req as ReqWithUser).user = user;

    next();
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in login controller", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

import { type Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const genJWT = (userId: Types.ObjectId, res: Response) => {
  const token = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return token;
};

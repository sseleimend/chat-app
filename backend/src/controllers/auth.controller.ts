import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";

import User, { type UserSchema } from "../models/user.model.ts";
import { genJWT } from "../lib/utils.ts";

type AuthReq<T = {}> = Request<{}, {}, T>;

export const signup = async (req: AuthReq<UserSchema>, res: Response) => {
  const { email, fullName, password, profilePic } = req.body;
  try {
    if (!email || !fullName || !password)
      return res.status(400).json({
        message: "All fields are required",
      });

    if (password.length < 6)
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });

    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({
        message: "Email already exists",
      });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (!newUser)
      return res.status(400).json({
        message: "Invalid user data",
      });

    genJWT(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in signup controller", error.message);
  }
};

export const login = (req: AuthReq, res: Response) => {
  res.send("login route");
};

export const logout = (req: AuthReq, res: Response) => {
  res.send("logout route");
};

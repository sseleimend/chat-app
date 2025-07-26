import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";

import User, {
  type LoginSchema,
  type UserSchema,
} from "../models/user.model.ts";
import { genJWT } from "../lib/utils.ts";
import { type ReqWithUser } from "../middlewares/auth.middleware.ts";
import cloudinary from "../lib/cloudinary.ts";

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
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req: AuthReq<LoginSchema>, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    genJWT(user._id, res);

    res.status(200).json({
      _id: user.id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in login controller", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = (req: AuthReq, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({
      message: "Logout successfully",
    });
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in login controller", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (
  req: AuthReq<{ profilePic: string }>,
  res: Response
) => {
  try {
    const { profilePic } = req.body;

    const userId = (req as ReqWithUser).user._id;

    if (!profilePic)
      return res.status(400).json({
        message: "Profile picture is required",
      });

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in login controller", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  try {
    res.status(200).json((req as ReqWithUser).user);
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in login controller", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

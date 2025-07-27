import { Request, Response } from "express";
import { ReqWithUser } from "../middlewares/auth.middleware";
import User from "../models/user.model";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = (req as ReqWithUser).user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in signup controller", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

import { Request, Response } from "express";
import { ReqWithUser } from "../middlewares/auth.middleware";
import User from "../models/user.model";
import { Message } from "../models/message.model";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = (req as ReqWithUser).user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in getUsersForSidebar controller", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = (req as ReqWithUser).user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in getMessages controller", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

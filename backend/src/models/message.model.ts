import mongoose from "mongoose";

export interface MessageDTO {}

const messageSchema = new mongoose.Schema<MessageDTO>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model<MessageDTO>("Message", messageSchema);

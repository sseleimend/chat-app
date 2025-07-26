import mongoose from "mongoose";

interface UserSchema {
  email: string;
  fullName: string;
  password: string;
  profilePic: string;
}

const userSchema = new mongoose.Schema<UserSchema>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserSchema>("User", userSchema);

export default User;

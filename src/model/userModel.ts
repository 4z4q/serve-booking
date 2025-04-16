import mongoose, { Document, Schema } from "mongoose";
import Joi from "joi";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "client" | "vendor" | "admin";
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 10,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["client", "vendor", "admin"],
    default: "client",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const validateUserUpdate = (user: Partial<IUser>) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(10),
    lastName: Joi.string().min(3).max(10),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    role: Joi.string().valid("client", "vendor", "admin"),
  });

  return schema.validate(user);
};

const userModel = mongoose.model<IUser>("users", userSchema);

export default userModel;

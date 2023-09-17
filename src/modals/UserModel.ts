// models/user.ts
import mongoose, { Document, Schema } from "mongoose";

// Define the user schema
export interface User {
  _id: string;
  firebaseId: any;
  email: string;
  phone_number: string;
  name: string;
  picture: string;
  role: string;
  // Add any other user properties you need
}

const userSchema = new Schema<User & Document>(
  {
    firebaseId: { type: String, required: true, unique: true },
    email: { type: String, required: false },
    phone_number: { type: String, required: false },
    name: { type: String, required: false },
    picture: { type: String },
    role: { type: String, enum: ["user", "delivery_user"], default: "user" },
  },
  { timestamps: true }
);

// Create and export the user model
export const UserModel =
  mongoose.models.User || mongoose.model<User & Document>("User", userSchema);

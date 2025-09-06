import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName : { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true }
});

export const TempUser = mongoose.model("tempUser", tempUserSchema);
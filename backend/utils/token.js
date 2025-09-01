import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";

export const generateToken = asyncHandler(async (userId) => {
  const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
});

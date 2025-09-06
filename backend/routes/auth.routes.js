import express from "express"
import {  resetPassword, passwordOtp, signIn, signOut, signUp, verifyOtp, emailOtp } from "../controllers/auth.controllers.js"

const authRouter = express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.get("/signout",signOut)
authRouter.post("/password-otp",passwordOtp)
authRouter.post("/verify-otp",verifyOtp)
authRouter.post("/email-otp",emailOtp)
authRouter.post("/reset-password",resetPassword)


export default authRouter
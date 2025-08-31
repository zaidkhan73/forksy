import express from "express"
import { signIn, signOut, signUp } from "../controllers/auth.controllers.js"

const authRouter = express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.get("/signout",signOut)

export default authRouter
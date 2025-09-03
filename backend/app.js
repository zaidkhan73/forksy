import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"

const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))



app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

export {app}
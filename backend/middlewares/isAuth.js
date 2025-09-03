import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token
        //console.log("Raw token from cookie:", token)
        //console.log("Cookies received:", req.cookies)


        if (!token) {
            return res.status(401).json({ message: "Token not found" })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = decodedToken.userId
        next()

    } catch (error) {
        console.error("isAuth error:", error.message)
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}

export default isAuth

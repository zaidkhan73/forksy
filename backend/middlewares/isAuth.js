import jwt from "jsonwebtoken"
import dotenv from "dotenv"

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token


        if(!token){
            return res.status(400).json({message: "token not found"})
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if(!decodedToken){
            return res.status(400).json({message: "token not verified"})
        }
        console.log("decodedToken : ",decodedToken)

        req.userId = decodedToken.userId

        next()
    } catch (error) {
        return res.status(500).json({message: "isAuth error"})
    }
}
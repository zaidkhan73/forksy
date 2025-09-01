import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {ApiError} from "../utils/apiError.js";
import { generateToken } from "../utils/token.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { sendOtpMail } from "../utils/mail.js";


const signUp = asyncHandler(async (req, res, next) => {
    //get data
    const {fullName, email, password, mobile, role} =req.body

    //check if email is valid
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new ApiError(409, "User already exists")
    }

    //check password and mobile number
    if(password.length < 6){
        throw new ApiError(400, "password must be atleast 6 characters long")
    }
    if(mobile.length !== 10){
        throw new ApiError(400, "mobile number must be 10 digits long")
    }

    //encode password
    const hashedPassword = await bcrypt.hash(password, 10)

    //create and store user in db
    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        mobile,
        role
    })
    
    //check if user is created
    const isUserCreated = await User.findOne(user._id).select("-password")
    if(!isUserCreated){
        throw new ApiError(500,"something went wrong while registering user")
    }
    
    //generate token
    const token = generateToken(user._id)

    //send cookies
    res.cookie("token",token,{
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
        httpOnly:true
    })

    //send response
    return res
    .status(201)
    .json(new ApiResponse(201, isUserCreated,"user registered successfully"))
})

const signIn = asyncHandler(async(req,res)=>{
    //get data from frontend
    const {email, password} = req.body

    if(!email){
        throw new ApiError(400, "email is required")
    }

    //find user by email
    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(400, "user does not exist")
    }

    //verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
        throw new ApiError(400, "password incorrect");
    }

    const loggedInUser = await User.findById(user._id).select("-password")

    //generate token
    const token = await generateToken(user._id)

    //send cookies
    res.cookie("token",token,{
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
        httpOnly:true
    })

    //send response
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {
            user: loggedInUser
        },
        "user signed in"
    ))

})

const signOut = asyncHandler(async(req,res)=>{
    return res
    .clearCookie("token")
    .json(new ApiResponse(200,{},"user signed out"))
})

const sendOtp = async (req,res)=>{
    try {
        //get user
        const {email} = req.body

        //find user
        const user = await User.findOne({email})

        //check if user exist
        if(!user){
            return res.status(400).json({
                message:"User does not exist"
            })
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp = otp,
        user.otpExpires = Date.now()+5*60*1000
        user.isOtpVerified=false
        await user.save()
        await sendOtpMail(email, otp, user.fullName)
        return res.status(200).json({message:"otp send successfully"})
    } catch (error) {
        return res.status(500).json(`error during sending otp ${error}`)
    }
}

export const verifyOtp = async(req,res)=>{
    try {
        const {email, otp} = req.body

        const user = await User.findOne({email})

        if(!user || user.resetOtp !== otp || user.otpExpires < Date.now()){
            return res.status(400).json({message: "invalid or expired otp"})
        }

        user.resetOtp=undefined
        user.isOtpVerified=true
        user.otpExpires=undefined

        await User.save() 

        return res.status(200).json({message:"otp verified successfully"})

    } catch (error) {
        return res.status(500).json(`otp verification failed ${error}`)
    }
}

export const resetPassword = async(req,res)=>{
    try {
        const {email, password} = req.body

        const user = await User.findone({email})

        if(!user || !user.isOtpVerified){
            return res.status(400).json({
                message:"Invalid User"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user.password = hashedPassword
        user.isOtpVerified=false

        await User.save()

        return res.status(200).json({message:"password reset successfull"})
    } catch (error) {
        return res.status(500).json(`password reset failed ${error}`)
    }
}


export {
    signIn,
    signUp,
    signOut,
    sendOtp,
    verifyOtp,
    resetPassword
}
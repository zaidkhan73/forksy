import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {ApiError} from "../utils/apiError.js";
import { generateToken } from "../utils/token.js";



const signUp = asyncHandler(async (req, res, next) => {
    //get data
    const {fullName, email, password, mobile, role} =req.body

    //check if email is valid
    const existingUser = await User.findOne({email})
    if(existingUser){
        throw new ApiError(409, "User already exists")
    }

    //check password and mobile number
    if(password.length){
        throw new ApiError(400, "password must be atleast 6 characters long")
    }
    if(mobile.length){
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


export {
    signIn,
    signUp,
    signOut
}
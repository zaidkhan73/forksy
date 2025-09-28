import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

const getCurrentUser = async (req,res) => {
    try {
        const userId = req.userId

        if(!userId){
            throw new ApiError(400, "userId not found");
        }

        const user = await User.findById(userId)

        if(!user){
            throw new ApiError(400, "user not found");
        }

        return res.status(200).json(user)
    } catch (error) {
        throw new ApiError(500, `getCurrentUser error: ${error}`);
    }
}

const updateLocation = async (req,res) => {
    try {
        const {lat,lon} = req.body

        if(!lat || !lon){
            return res.status(400).json({
                message:"lat and lon are required"
            })
        }
        const user = await User.findByIdAndUpdate(req.userId,{
            location:{
                type:"Point",
                coordinates:[lon,lat]
            }
        },{
            new:true
        })
        if(!user){
            return res.status(400).json({
                message:"user not found"
            })
        }else{
            return res.status(200).json(user.location)
        }

    } catch (error) {
        return res.status(500).json({
            message:"Error while updating location",
            error:error.message
        })
    }
}

export {
    getCurrentUser,
    updateLocation
}
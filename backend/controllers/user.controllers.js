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

export {
    getCurrentUser
}
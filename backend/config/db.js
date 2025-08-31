import mongoose from "mongoose";
import dotenv from "dotenv"

export const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`\n MongoDB connected !! DB HOST: ${connect.connection.host}`)
    } catch (error) {
        console.log("db error :", error);
        process.exit(1)
    }
}
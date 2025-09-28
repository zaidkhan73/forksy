import mongoose from "mongoose";

const deliveryAssignmentSchema = new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
    },
    shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop"
    },
    shopOrderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true
    },
    broadcastedTo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    status:{
        type:String,
        enum:["broadcasted","assigned","completed"],
        default:"broadcasted"
    },
    acceptedAt:{
        type:Date,
        default:null
    },
},{timestamps:true})



export const DeliveryAssignment = mongoose.model("DeliveryAssignment",deliveryAssignmentSchema)
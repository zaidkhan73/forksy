import mongoose from "mongoose";

const shopOrderItemSchema = new mongoose.Schema({
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item"}
    ,
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
},{timestamps:true})

const shopOrderSchema =new mongoose.Schema({
    shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop",
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    subtotal:{
        type:Number,
        required:true
    },
    shopOrderItems:[shopOrderItemSchema]
},{timestamps:true})

const orderSchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    paymentMethod:{
        type:String,
        enum:['cod','online'],
        required:true
    },
    deliveryAddress:{
        text:String,
        latitude:Number,
        longitude:Number,
    },
    totalAmount:{
        type:Number,
        required:true
    },
    shopOrders:[shopOrderSchema]

},{timestamps:true})

export const Order = mongoose.model("Order",orderSchema)
export const ShopOrder = mongoose.model("ShopOrder",shopOrderSchema)
export const ShopOrderItem = mongoose.model("ShopOrderItem",shopOrderItemSchema)
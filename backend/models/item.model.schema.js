import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    shop:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Shop"
    },
    category:{
        type:String,
        enum:[
            "Snacks",
            "Main Course",
            "Desserts",
            "Pizza",
            "Sandwiches",
            "South Indian",
            "North Indian",
            "Chinese",
            "Fast Food",
            "Others",
        ],
        default:"Snacks",
        required:true
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    foodType:{
        type:String,
        enum:[
            "Veg",
            "Nonveg"
        ],
        required:true
    }
},{timestamps:true})

export const Item = mongoose.model("Item",itemSchema)
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a fullName'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: [true, 'Email already exists'],
  },    
  password: {
    type: String,
  },
  mobile: {
    type: String,
    required: [true, 'Please add a mobile'],
  },
  role:{
    type: String,
    enum:['user','owner','deliveryBoy'],
    required: true,
    default: 'user'
  },
  resetOtp:{
    type:String
  },
  isEmailVerified:{
    type:Boolean,
    default:false
  },
  isOtpVerified:{
    type:Boolean,
    default:false
  },
  otpExpires:{
    type:Date
  }
}, {
  timestamps: true,
});

export const User = mongoose.model("User", userSchema);
/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { severUrl } from "../App";



function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const res = await axios.post(`${severUrl}/api/auth/signin`,{
        email,
        password,
      },{withCredentials:true})
      console.log(res)
    } catch (error) {
      console.log("error: ",error)
    }
  }

  return (
    <div className="min-h-screen bg-sage-100 w-full flex items-center justify-center p-4">
      <div className="bg-white w-full rounded-xl shadow-lg max-w-md p-8 border-[1px] boder-solid border-cream-50">
        <h1 className={`text-3xl font-bold mb-2 text-primary-900`}>Forksy</h1>
        <p className="text-gray-600 mb-8">Sign In to your account to get started</p>
        
        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none border-neutral-400 focus:border-primary-900"
            placeholder="Enter your Email"
            required
          />
        </div>
       
        {/* password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative mb-2">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={`${showPassword ? "text" : "password"}`}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none border-neutral-400 focus:border-primary-900"
              placeholder="Enter your password"
              required
            />
            <button
              className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <IoMdEye /> : <IoMdEyeOff />}
            </button>
          </div>
          <div className="text-sm font-medium text-right text-primary-400 cursor-pointer" onClick={() => {navigate("/forgotpassword")}}>forgot password</div>
        </div>

       
        <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-primary-700 hover:bg-primary-800 text-white cursor-pointer"
        onClick={handleSignIn}>
        Sign In
      </button>
      <button className="mt-4 w-full flex items-center justify-center gap-2 border solid border-neutral-400 hover:bg-gray-200 rounded-lg px-4 py-2 transition duration-200 cursor-pointer">
        <FcGoogle />
        <span>Sign In wth google</span>
        
      </button>
      <p className="text-center mt-2">Don't have an Account ? <span className="text-primary-400 cursor-pointer" onClick={() => navigate("/signup")}>Sign Up</span></p>
      </div>
      
    </div>
  );
}

export default SignIn;

/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { severUrl } from "../App";



function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const res = await axios.post(`${severUrl}/api/auth/signup`,{
        fullName,
        email,
        mobile,
        password,
        role
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
        <p className="text-gray-600 mb-8">Create your account to get started</p>
        {/* FUllName */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
          onChange={(e) => setFullName(e.target.value)}
          value={fullName}
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none border-neutral-400 focus:border-primary-900"
            placeholder="Enter your full Name"
            required
          />
        </div>
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
        {/* Mobile */}
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-gray-700 font-medium mb-1"
          >
            mobile no
          </label>
          <input
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
            type="phone"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none border-neutral-400 focus:border-primary-900"
            placeholder="Enter your number"
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
          <div className="relative">
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
        </div>

        {/* roles */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role
          </label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                onClick={() => setRole(r)}
                className={
                  role === r
                    ? "flex-1 border-[1px] solid  hover:shadow-md rounded-lg px-3 py-2 text-center font-medium transition-colors bg-primary-700 text-white cursor-pointer"
                    : "flex-1 border solid border-neutral-400 hover:shadow-md rounded-lg px-3 py-2 text-center text-primary-700 font-medium transition colors hover:bg-sage-100 cursor-pointer"
                }
              >
                {r}
              </button>
            ))}
          </div>

        </div>
        <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-primary-700 hover:bg-primary-800 text-white cursor-pointer"
        onClick={handleSignUp}>
        Sign Up
      </button>
      <button className="mt-4 w-full flex items-center justify-center gap-2 border solid border-neutral-400 hover:bg-gray-200 rounded-lg px-4 py-2 transition duration-200 cursor-pointer">
        <FcGoogle />
        <span>Sign up wth google</span>
        
      </button>
      <p className="text-center mt-2">Already have an Account ? <span className="text-primary-400 cursor-pointer" onClick={() => navigate("/signin")}>Sign In</span></p>
      </div>
      
    </div>
  );
}

export default SignUp;

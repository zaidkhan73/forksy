/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners"

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    // Clear previous error message
    setErrorMessage("");

    // Client-side validation
    if (password.length < 6) {
      setErrorMessage("password must be atleast 6 characters long");
      return;
    }

    if (mobile.length !== 10) {
      setErrorMessage("mobile number must be 10 digits long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${serverUrl}/api/auth/signup`,{
        fullName,
        email,
        mobile,
        password,
        role
      },{withCredentials:true})
      
      console.log(res);
      
      // Handle successful signup here
      // For example: navigate to signin, show success message, etc.
      
    } catch (error) {
      console.log("error: ", error);
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 409) {
          setErrorMessage("User already exists");
        } else if (error.response.status === 400) {
          // Handle validation errors from backend
          const errorData = error.response.data;
          if (errorData.message) {
            // Display the exact error message from backend
            setErrorMessage(errorData.message);
          } else {
            setErrorMessage("Please check your input and try again");
          }
        } else if (error.response.status === 422) {
          setErrorMessage("Invalid input data. Please check all fields");
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        // Network error
        setErrorMessage("Network error. Please check your connection.");
      } else {
        // Other errors
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Clear error message when user starts typing in any field
  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  }

  const handleMobileChange = (e) => {
    setMobile(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  }

  return (
    <div className="min-h-screen bg-sage-100 w-full flex items-center justify-center p-4">
      <div className="bg-white w-full rounded-xl shadow-lg max-w-md p-8 border-[1px] boder-solid border-cream-50">
        <h1 className={`text-3xl font-bold mb-2 text-primary-900`}>Forksy</h1>
        <p className="text-gray-600 mb-8">Create your account to get started</p>
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}
        
        {/* Full Name */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
            onChange={handleFullNameChange}
            value={fullName}
            type="text"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
              errorMessage 
                ? "border-red-300 focus:border-red-500" 
                : "border-neutral-400 focus:border-primary-900"
            }`}
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
            onChange={handleEmailChange}
            value={email}
            type="email"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
              errorMessage 
                ? "border-red-300 focus:border-red-500" 
                : "border-neutral-400 focus:border-primary-900"
            }`}
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
            Mobile No
          </label>
          <input
            onChange={handleMobileChange}
            value={mobile}
            type="tel"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
              errorMessage 
                ? "border-red-300 focus:border-red-500" 
                : "border-neutral-400 focus:border-primary-900"
            }`}
            placeholder="Enter your number"
            required
          />
        </div>
        
        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              onChange={handlePasswordChange}
              value={password}
              type={`${showPassword ? "text" : "password"}`}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors ${
                errorMessage 
                  ? "border-red-300 focus:border-red-500" 
                  : "border-neutral-400 focus:border-primary-900"
              }`}
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

        {/* Roles */}
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
                key={r}
                onClick={() => setRole(r)}
                className={
                  role === r
                    ? "flex-1 border-[1px] solid hover:shadow-md rounded-lg px-3 py-2 text-center font-medium transition-colors bg-primary-700 text-white cursor-pointer"
                    : "flex-1 border solid border-neutral-400 hover:shadow-md rounded-lg px-3 py-2 text-center text-primary-700 font-medium transition-colors hover:bg-sage-100 cursor-pointer"
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          className={`w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 text-white cursor-pointer ${
            isLoading 
              ? "bg-primary-400 cursor-not-allowed" 
              : "bg-primary-700 hover:bg-primary-800"
          }`}
          onClick={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ClipLoader size={20}/>
            </>
          ) : (
            "Sign Up"
          )}
        </button>
        
        <button className="mt-4 w-full flex items-center justify-center gap-2 border solid border-neutral-400 hover:bg-gray-200 rounded-lg px-4 py-2 transition duration-200 cursor-pointer">
          <FcGoogle />
          <span>Sign up with google</span>
        </button>
        
        <p className="text-center mt-2">Already have an Account ? <span className="text-primary-400 cursor-pointer" onClick={() => navigate("/signin")}>Sign In</span></p>
      </div>
    </div>
  );
}

export default SignUp;
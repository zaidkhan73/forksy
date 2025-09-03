/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader }  from "react-spinners"
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";


function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()

  const handleSignIn = async () => {
    // Clear previous error message
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${serverUrl}/api/auth/signin`,{
        email,
        password,
      },{withCredentials:true})
      
      dispatch(setUserData(res.data))
      
      // Handle successful login here
      // For example: navigate to dashboard, store user data, etc.
      
    } catch (error) {
      console.log("error: ", error);
      
      // Use backend error message directly
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
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

  // Clear error message when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
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
        <p className="text-gray-600 mb-8">Sign In to your account to get started</p>
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}
        
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
          <div className="text-sm font-medium text-right text-primary-400 cursor-pointer" onClick={() => {navigate("/forgotpassword")}}>forgot password</div>
        </div>

        <button 
          className={`w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 text-white cursor-pointer ${
            isLoading 
              ? "bg-primary-400 cursor-not-allowed" 
              : "bg-primary-700 hover:bg-primary-800"
          }`}
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ClipLoader size={20}/>
            </>
          ) : (
            "Sign In"
          )}
        </button>
        
        <p className="text-center mt-6">Don't have an Account ? <span className="text-primary-400 cursor-pointer" onClick={() => navigate("/signup")}>Sign Up</span></p>
      </div>
    </div>
  );
}

export default SignIn;
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";
import { useSelector } from "react-redux";

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
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otp, setOtp] = useState("");
  const otpRefs = useRef([]);
   const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
      if (userData && Object.keys(userData).length > 0) {
        navigate("/");
      }
    }, [userData, navigate]);

  const handleSendOtp = async () => {
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
      const res = await axios.post(
        `${serverUrl}/api/auth/email-otp`,
        { email , fullName },
        { withCredentials: true }
      );
      console.log(res);
      setStep(2);
    } catch (error) {
      console.log("error in sending otp : ", error);

      if (error.response?.data) {
        setErrorMessage(error.response.data);
      } else if (error.request) {
        setErrorMessage("Network error. Please check your connection.");
        console.log("error : ",error)
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          mobile,
          password,
          role,
          otp
        },
        { withCredentials: true }
      );

      dispatch(setUserData(res.data.user));

      // Handle successful signup here
      // For example: navigate to signin, show success message, etc.
    } catch (error) {
      console.log("error: ", error);

      // Use backend error message directly
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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
  };

  // Clear error message when user starts typing in any field
  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleMobileChange = (e) => {
    setMobile(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    setOtp(newOtpDigits.join(""));

    // Clear error when user starts typing OTP
    if (errorMessage) {
      setErrorMessage("");
    }

    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtpDigits = [...otpDigits];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtpDigits[i] = pastedData[i];
      }
    }
    setOtpDigits(newOtpDigits);
    setOtp(newOtpDigits.join(""));

    // Clear error when pasting OTP
    if (errorMessage) {
      setErrorMessage("");
    }

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtpDigits.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    otpRefs.current[focusIndex]?.focus();
  };

  const isOtpComplete = otpDigits.every(digit => digit !== "");

  return (
    <div className="min-h-screen bg-sage-100 w-full flex items-center justify-center p-4">
      <div className="bg-white w-full rounded-xl shadow-lg max-w-md p-8 border-[1px] boder-solid border-cream-50">
        {step === 1 && (
          <>
            <h1 className={`text-3xl font-bold mb-2 text-primary-900`}>
              Forksy
            </h1>
            <p className="text-gray-600 mb-8">
              Create your account to get started
            </p>

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
              onClick={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ClipLoader size={20} />
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <p className="text-center mt-6">
              Already have an Account ?{" "}
              <span
                className="text-primary-400 cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </span>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center gap-4 mb-4">
              
              <h1 className="text-2xl font-bold text-center text-primary-900">
                Verify Your Email
              </h1>
            </div>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-2"
              >
                Enter OTP
              </label>
              <div className="flex gap-2 justify-center">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none transition-colors ${
                      errorMessage 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-neutral-400 focus:border-primary-900"
                    }`}
                    maxLength="1"
                    inputMode="numeric"
                    pattern="\d*"
                  />
                ))}
              </div>
            </div>
            <button
              className={`w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 text-white ${
                !isOtpComplete || isLoading
                  ? "bg-primary-400 cursor-not-allowed" 
                  : "bg-primary-700 hover:bg-primary-800 cursor-pointer"
              }`}
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUp;

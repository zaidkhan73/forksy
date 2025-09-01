/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

function ForgotPassword() {
  const [step, setStep] = useState(3);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    setOtp(newOtpDigits.join(""));

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

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtpDigits.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    otpRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="min-h-screen bg-sage-100 w-full flex items-center justify-center p-4">
      <div className="bg-white w-full rounded-xl shadow-lg max-w-md p-8 border-[1px] boder-solid border-cream-50">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-primary-900 cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-center text-primary-900">
            Forgot Password
          </h1>
        </div>

        {step === 1 && (
          <div>
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
            <button
              className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-primary-700 hover:bg-primary-800 text-white cursor-pointer"
              onClick={() => setStep(2)}
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
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
                    className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none border-neutral-400 focus:border-primary-900 transition-colors"
                    maxLength="1"
                    inputMode="numeric"
                    pattern="\d*"
                  />
                ))}
              </div>
            </div>
            <button
              className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-primary-700 hover:bg-primary-800 text-white cursor-pointer"
              onClick={() => {
                console.log("OTP entered:", otp);
                setStep(3);
                // Handle verification logic here
              }}
            >
              Verify
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                New Password
              </label>
              <div className="relative mb-4">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={`${showPassword ? "text" : "password"}`}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none border-neutral-400 focus:border-primary-900"
                  placeholder="Enter new password"
                  required
                />

                <button
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {!showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                </button>
              </div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  type={"password"}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none border-neutral-400 focus:border-primary-900"
                  placeholder="confirm your password"
                  required
                />
              </div>
            </div>
            <button
              className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 bg-primary-700 hover:bg-primary-800 text-white cursor-pointer"
              onClick={() => setStep(3)}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

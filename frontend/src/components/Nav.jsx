// components/Nav.jsx
import React from "react";
import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { TbReceipt } from "react-icons/tb";

function Nav() {
  const { userData, city } = useSelector((state) => state.user);
  const { shopData } = useSelector((state) => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout calls

    setIsLoggingOut(true);
    setShowInfo(false); // Close the dropdown

    try {
      const res = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });

      // Clear user data first
      dispatch(setUserData(null));

      // Navigate to signin page
      navigate("/signin", { replace: true });

      console.log("Logged out successfully:", res);
    } catch (error) {
      console.log("Logout error:", error);

      // Even if the server request fails, clear local state
      dispatch(setUserData(null));
      navigate("/signin", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Don't render if no user data
  if (!userData) {
    return null;
  }

  return (
    <div className="w-full h-16 sm:h-20 lg:h-24 flex items-center justify-between md:justify-center gap-4 sm:gap-6 lg:gap-8 bg-sage-50 px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 fixed top-0 z-[9999] overflow-visible">
      {/* Mobile Search Bar */}
      {showSearch && userData.role === "user" && (
        <div className="w-[95%] sm:w-[90%] h-14 sm:h-16 bg-white shadow-xl rounded-lg flex items-center gap-3 sm:gap-5 fixed top-16 sm:top-20 left-[2.5%] sm:left-[5%] md:hidden z-50">
          <div className="flex items-center w-[35%] sm:w-[30%] overflow-hidden gap-2 sm:gap-3 px-2 sm:px-3 border-r-2 border-gray-400">
            <FaLocationDot className="text-primary-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <div className="truncate text-gray-600 text-xs sm:text-sm">
              {city || "Loading..."}
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 sm:gap-3 pr-3">
            <IoSearch
              size={20}
              className="text-primary-600 sm:w-6 sm:h-6 flex-shrink-0"
            />
            <input
              type="text"
              placeholder="Search delicious food"
              className="px-2 text-gray-700 outline-0 w-full text-sm sm:text-base"
            />
          </div>
        </div>
      )}

      {/* Logo */}
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary-600 flex-shrink-0">
        Forksy
      </h1>

      {/* Desktop Search Bar */}
      {userData.role === "user" && (
        <div className="hidden md:flex w-[50%] lg:w-[45%] xl:w-[40%] h-12 lg:h-16 bg-white shadow-xl rounded-lg items-center gap-4">
          <div className="flex items-center w-[35%] lg:w-[30%] overflow-hidden gap-2 lg:gap-3 px-3 lg:px-4 border-r-2 border-gray-400">
            <FaLocationDot className="text-primary-600 w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
            <div className="truncate text-gray-600 text-sm lg:text-base">
              {city || "Loading..."}
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 lg:gap-3 pr-3">
            <IoSearch
              size={20}
              className="text-primary-600 lg:w-6 lg:h-6 flex-shrink-0"
            />
            <input
              type="text"
              placeholder="Search delicious food"
              className="px-2 text-gray-700 outline-0 w-full text-sm lg:text-base"
            />
          </div>
        </div>
      )}

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        {/* Mobile Search Toggle */}
        {userData.role === "user" &&
          (showSearch ? (
            <RxCross2
              size={20}
              className="text-primary-600 md:hidden transition-all cursor-pointer sm:w-6 sm:h-6"
              onClick={() => setShowSearch((prev) => !prev)}
            />
          ) : (
            <IoSearch
              size={20}
              className="text-primary-600 md:hidden transition-all cursor-pointer sm:w-6 sm:h-6"
              onClick={() => setShowSearch((prev) => !prev)}
            />
          ))}

        {/* Owner Actions */}
        {userData.role === "owner" ? (
          <>
            {shopData && (
              <>
                {/* Add Food Items Button */}
                {/* For medium and larger screens only */}
                <button
                  className="hidden md:flex gap-1 lg:gap-2 items-center px-2 py-1 lg:px-3 lg:py-2 
             cursor-pointer rounded-full bg-primary-100 text-primary-600 
             text-sm lg:text-base font-medium"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={16} className="lg:w-5 lg:h-5" />
                  <span>Add Food Items</span>
                </button>

                {/* For small screens only */}
                <button
                  className="flex md:hidden items-center p-2 
             cursor-pointer rounded-full bg-primary-100 text-primary-600"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={16} className="sm:w-5 sm:h-5" />
                </button>

                
              </>
            )}

            {/* My Orders */}
            <div className="flex items-center gap-1 sm:gap-2 cursor-pointer relative px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-primary-100 text-primary-600 font-medium">
              <TbReceipt size={20} />
              <span className="hidden sm:block text-sm lg:text-base">
                My Orders
              </span>
              <span className="absolute -right-1 sm:-right-2 -top-1 sm:-top-2 text-xs font-bold text-white rounded-full bg-primary-600 px-1 sm:px-[6px] py-0 sm:py-[1px] min-w-[16px] sm:min-w-[20px] text-center">
                0
              </span>
            </div>
          </>
        ) : userData.role === "user" ? (
          <>
            {/* Shopping Cart */}
            <div className="relative cursor-pointer">
              <IoCartOutline
                size={20}
                className="text-primary-600 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
              />
              <span className="absolute -right-1 sm:-right-2 -top-2 sm:-top-3 text-xs font-bold text-white rounded-full bg-primary-600 px-1 sm:px-[6px] min-w-[16px] sm:min-w-[18px] text-center">
                0
              </span>
            </div>

            {/* My Orders Button - Desktop */}
            <button className="hidden md:block px-2 lg:px-3 py-1 lg:py-2 rounded-lg bg-primary-100 text-primary-600 text-sm lg:text-base font-medium">
              My Orders
            </button>
          </>
        ) : null}

        {/* User Profile */}
        <div className="relative">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-primary-600 text-white text-sm sm:text-base lg:text-lg shadow-xl font-semibold cursor-pointer transition-all hover:bg-primary-700"
            onClick={() => setShowInfo((prev) => !prev)}
          >
            {userData?.fullName?.slice(0, 1)?.toUpperCase() || "U"}
          </div>

          {/* Profile Dropdown */}
          {showInfo && (
            <div className="absolute top-10 sm:top-12 lg:top-14 right-0 w-40 sm:w-44 lg:w-48 bg-white shadow-2xl rounded-xl p-2 sm:p-3 flex flex-col z-[9999] transition-all">
              <div className="text-sm sm:text-base lg:text-lg font-semibold py-2 px-2 border-b border-gray-100">
                {userData.fullName}
              </div>

              {/* Mobile My Orders */}
              {userData.role === "user" && (
                <div className="md:hidden text-primary-600 font-semibold cursor-pointer hover:bg-primary-50 py-2 rounded-lg px-2 transition-all text-sm sm:text-base">
                  My Orders
                </div>
              )}

              {/* Logout */}
              <div
                className={`text-primary-600 font-semibold cursor-pointer hover:bg-primary-50 py-2 rounded-lg px-2 transition-all text-sm sm:text-base ${
                  isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleLogout}
              >
                {isLoggingOut ? "Logging out..." : "Log Out"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;

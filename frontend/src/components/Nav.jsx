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

function Nav() {
  const { userData, city } = useSelector((state) => state.user);
  
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
      const res = await axios.get(`${serverUrl}/api/auth/signout`, {withCredentials: true});
      
      // Clear user data first
      dispatch(setUserData(null));
      
      // Navigate to signin page
      navigate('/signin', { replace: true });
      
      console.log('Logged out successfully:', res);
    } catch (error) {
      console.log("Logout error:", error);
      
      // Even if the server request fails, clear local state
      dispatch(setUserData(null));
      navigate('/signin', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Don't render if no user data
  if (!userData) {
    return null;
  }

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] bg-sage-50 px-[20px] fixed top-0 z-[9999] overflow-visible">
      {showSearch && (
        <div className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg flex items-center gap-[20px] flex fixed top-[80px] left-[5%] md:hidden">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot className="text-primary-600 w-[25px] h-[25px]" />
            <div className="w-[80%] truncate text-gray-600">{city || 'Loading...'}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoSearch size={25} className="text-primary-600" />
            <input
              type="text"
              placeholder="search delicious food"
              className="px-[10px] text-gray-700 outline-0 w-full"
            />
          </div>
        </div>
      )}
      
      <h1 className="text-3xl font-bold mb-2 text-primary-600">Forksy</h1>
      
      <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg flex items-center gap-[20px] hidden md:flex">
        <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
          <FaLocationDot className="text-primary-600 w-[25px] h-[25px]" />
          <div className="w-[80%] truncate text-gray-600">{city || 'Loading...'}</div>
        </div>
        <div className="w-[80%] flex items-center gap-[10px]">
          <IoSearch size={25} className="text-primary-600" />
          <input
            type="text"
            placeholder="search delicious food"
            className="px-[10px] text-gray-700 outline-0 w-full"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {showSearch ? (
          <RxCross2 
            size={25} 
            className="text-primary-600 md:hidden transition-all cursor-pointer" 
            onClick={() => setShowSearch(prev => !prev)}
          />
        ) : (
          <IoSearch 
            size={25} 
            className="text-primary-600 md:hidden transition-all cursor-pointer" 
            onClick={() => setShowSearch(prev => !prev)} 
          />
        )}
        
        <div className="relative cursor-pointer">
          <IoCartOutline size={25} className="text-primary-600" />
          <span className="absolute right-[-9px] top-[-12px] text-white rounded-full bg-primary-600 px-[6px]">
            0
          </span>
        </div>
        
        <button className="hidden md:block px-3 py-1 rounded-lg bg-primary-100 text-primary-600 text-sm medium-font">
          My Order
        </button>
        
        <div className="relative">
          <div
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-primary-600 text-white text-[18px] shadow-xl font-semibold cursor-pointer"
            onClick={() => setShowInfo((prev) => !prev)}
          >
            {userData?.fullName?.slice(0, 1)?.toUpperCase() || 'U'}
          </div>
          
          {showInfo && (
            <div className="absolute top-[50px] right-0 w-[180px] bg-white shadow-2xl rounded-xl p-[10px] flex flex-col z-[9999] transition-all">
              <div className="text-[17px] font-semibold py-2 px-2">
                {userData.fullName}
              </div>
              <div className="md:hidden text-primary-600 font-semibold cursor-pointer hover:bg-primary-50 py-2 rounded-lg px-2 transition-all">
                My Orders
              </div>
              <div 
                className={`text-primary-600 font-semibold cursor-pointer hover:bg-primary-50 py-2 rounded-lg px-2 transition-all ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleLogout}
              >
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
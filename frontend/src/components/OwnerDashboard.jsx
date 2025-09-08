import React from "react";
import Nav from "../components/Nav.jsx";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";

function OwnerDashboard() {
  const { shopData } = useSelector((state) => state.owner);
  return (
    <div className="w-full bg-sage-50 min-h-screen flex flex-col items-center overflow-hidden">
      <Nav />
      {!shopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-primary-600 w-16 h-16 sm:w-20 sm:h-20 mb-4 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Join our food delivery platform and reach thousands of customers
                worldwide.
              </p>
              <button
                className="
    relative overflow-hidden
    bg-gradient-to-r from-cream-500 via-primary-600 to-primary-800
    bg-[length:200%_200%] bg-[position:0%_50%]
    hover:bg-[position:100%_50%]
    text-white px-6 sm:px-7 py-2.5 rounded-full font-medium shadow-lg
    transition-all duration-700 ease-in-out
    transform 
  "
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;

import React from "react";
import Nav from "../components/Nav.jsx";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { GiShop } from "react-icons/gi";



function OwnerDashboard() {
  const { shopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  return (
    <div className="w-full bg-sage-100 min-h-screen flex flex-col items-center overflow-hidden">
      <Nav />
      {!shopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <GiShop className="text-primary-600 w-16 h-16 sm:w-20 sm:h-20 mb-4 animate-pulse" />
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
                onClick={() => navigate("/create-edit-shop")}
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      )}
      {shopData && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center">
            <FaUtensils
              className="text-primary-600 w-14 h-14"
            />
            Welcome to {shopData.name}
          </h1>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative">
            <div className="absolute top-4 right-4 bg-primary-600 text-white p-2 rounded-full shadow-md hover:bg-primary-800 transition-all duration-300 cursor-pointer" onClick={() => navigate("/create-edit-shop")}>
              <FaPen size={20}/>
            </div>
            <img src={shopData.image} alt={shopData.name} className="w-full h-48 sm:h-64 object-cover" />
            <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{shopData.name}</h1>
            <p className="text-gray-500  ">{shopData.city},{shopData.state}</p>
            <p className="text-gray-500 mb-4 ">{shopData.address}</p>
          </div>
          </div>
          {shopData.items.length === 0 && 
          <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-primary-600 w-16 h-16 sm:w-20 sm:h-20 mb-4 " />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Food Item
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Share your delicious creations with our customers by adding them to the menu.
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
                onClick={() => navigate("/add-item")}
              >
                Add item
              </button>
            </div>
          </div>
        </div>
          }
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;

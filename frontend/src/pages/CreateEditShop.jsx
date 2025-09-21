import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUtensils, FaClock, FaToggleOn, FaToggleOff } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { setShopData } from "../../redux/ownerSlice";

function CreateEditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shopData } = useSelector((state) => state.owner);
  const { city, state, address } = useSelector((state) => state.user);

  const [name, setName] = useState(shopData?.name || "");
  const [Address, setAddress] = useState(shopData?.address || address);
  const [City, setCity] = useState(shopData?.city || city);
  const [State, setState] = useState(shopData?.state || state);
  const [frontendImage, setFrontendImage] = useState(shopData?.image || null);
  const [backendImage, setBackendImage] = useState("");
  const [openingTime, setOpeningTime] = useState(shopData?.openingTime || "09:00");
  const [closingTime, setClosingTime] = useState(shopData?.closingTime || "21:00");
  const [isOpen, setIsOpen] = useState(shopData?.isOpen !== undefined ? shopData.isOpen : true);
  const [isLoading, setIsLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", Address);
      formData.append("city", City);
      formData.append("state", State);
      formData.append("openingTime", openingTime);
      formData.append("closingTime", closingTime);
      formData.append("isOpen", isOpen);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(`${serverUrl}/api/shop/create-edit-shop`, formData, { withCredentials: true });
      dispatch(setShopData(res.data));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex justify-center items-center p-2">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-105 border border-white/50"
      >
        <IoArrowBack size={20} className="text-gray-700" />
      </button>

      {/* Form Card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-xl shadow-xl border border-white/50 p-4 sm:p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mb-2 shadow-md mx-auto">
            <FaUtensils className="text-white w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {shopData ? "Edit Shop" : "Create Shop"}
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">Manage your restaurant details</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Shop Name */}
          <input
            type="text"
            placeholder="Shop Name"
            className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Shop Image */}
          <input
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            onChange={handleImage}
          />
          {frontendImage && (
            <img src={frontendImage} alt="Shop preview" className="w-full h-32 object-cover rounded-lg shadow-md" />
          )}

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="City"
              className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={City}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={State}
              onChange={(e) => setState(e.target.value)}
            />
          </div>

          {/* Address */}
          <input
            type="text"
            placeholder="Full Address"
            className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={Address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* Operating Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className="flex items-center gap-1 text-xs text-gray-600"><FaClock size={14}/> Opening</label>
              <input
                type="time"
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="flex items-center gap-1 text-xs text-gray-600"><FaClock size={14}/> Closing</label>
              <input
                type="time"
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
              />
            </div>
          </div>

          {/* Shop Status */}
          <div className="flex items-center justify-between bg-gray-50/80 border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <div>
              {isOpen ? "🟢 Open" : "🔴 Closed"}
            </div>
            <button type="button" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaToggleOn size={20} className="text-emerald-600"/> : <FaToggleOff size={20} className="text-gray-400"/>}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg text-white text-sm font-medium ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            }`}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEditShop;

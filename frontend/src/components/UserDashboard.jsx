import React, { useRef } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";

function UserDashboard() {
  const { city, shopInCity, itemInCity } = useSelector((state) => state.user);

  const categoriesRef = useRef();
  const shopsRef = useRef(); // ✅ new ref for shops

  const handleScrollCategory = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollShop = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const isShopCurrentlyOpen = (shop) => {
    if (!shop.isOpen) return false;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const parseTime = (timeString) => {
      const [hours, minutes] = timeString.split(":").map(Number);
      return hours * 60 + minutes;
    };
    const openingMinutes = parseTime(shop.openingTime);
    const closingMinutes = parseTime(shop.closingTime);

    if (closingMinutes < openingMinutes) {
      return currentTime >= openingMinutes || currentTime <= closingMinutes;
    }
    return currentTime >= openingMinutes && currentTime <= closingMinutes;
  };

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <div className="w-full bg-sage-100 min-h-screen flex flex-col items-center">
      <Nav />

      {/* Categories Section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold">
          Inspiration For Your First Order
        </h1>
        <div className="w-full flex items-center gap-4">
          <button
            className="px-2 py-2 h-[35px] rounded-full bg-white/10 backdrop-blur-md border border-white/30 shadow-md hover:bg-white/20 transition-all duration-300"
            onClick={() => handleScrollCategory(categoriesRef, "left")}
          >
            <FaChevronLeft className="text-primary-600" />
          </button>

          <div
            className="w-full flex overflow-x-auto pb-2 gap-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scroll-smooth"
            ref={categoriesRef}
          >
            {categories.map((category, index) => (
              <CategoryCard data={category} key={index} />
            ))}
          </div>

          <button
            className="px-2 py-2 h-[35px] rounded-full bg-white/10 backdrop-blur-md border border-white/30 shadow-md hover:bg-white/20 transition-all duration-300"
            onClick={() => handleScrollCategory(categoriesRef, "right")}
          >
            <FaChevronRight className="text-primary-600" />
          </button>
        </div>
      </div>

      {/* Best Shops Section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold">
          Best Shop In {city}
        </h1>

        {shopInCity?.length > 0 && shopInCity[0]?.city === city && (
          <div className="w-full flex items-center gap-4">
  {/* Left Scroll Button */}
  <button
    className="px-2 py-2 h-[35px] rounded-full bg-white/10 backdrop-blur-md border border-white/30 shadow-md hover:bg-white/20 transition-all duration-300"
    onClick={() => handleScrollShop(shopsRef, "left")}
  >
    <FaChevronLeft className="text-primary-600" />
  </button>

  {/* Scrollable Shops */}
  <div
    className="w-full flex overflow-x-auto pb-2 gap-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scroll-smooth"
    ref={shopsRef}
  >
    {shopInCity.map((shop, index) => {
      const isCurrentlyOpen = isShopCurrentlyOpen(shop);
      return (
        <div
          key={index}
          className="group relative flex flex-col bg-white/30 backdrop-blur-md border border-white/30 rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 w-52 sm:w-56"
        >
          <div className="relative w-full h-32">
            <img
              src={shop.image}
              alt={shop.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=Shop+Image";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute top-1.5 right-1.5">
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 backdrop-blur-md border ${
                  isCurrentlyOpen
                    ? "bg-green-500/30 text-green-100 border-green-300"
                    : "bg-red-500/20 text-red-600 border-red-300"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCurrentlyOpen ? "bg-green-700" : "bg-red-500"
                  } animate-pulse`}
                ></div>
                {isCurrentlyOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>
          </div>

          <div className="flex-1 p-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-primary-700 transition-colors">
                {shop.name}
              </h3>
              <p className="text-gray-700 text-[11px] leading-snug line-clamp-2">
                {shop.address}
              </p>
              <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-white/40">
                <span className="text-gray-800 text-[10px] font-medium">
                  {formatTime(shop.openingTime)} - {formatTime(shop.closingTime)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCurrentlyOpen ? "bg-green-500" : "bg-red-500"
                  } animate-pulse`}
                ></div>
                <span className="text-[10px] text-gray-600">
                  {isCurrentlyOpen ? "Accepting orders" : "Closed"}
                </span>
              </div>
            </div>
            <button
              disabled={!isCurrentlyOpen}
              className={`mt-2 px-2.5 py-1 rounded-md font-semibold text-[10px] transition-all duration-300 ${
                isCurrentlyOpen
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isCurrentlyOpen ? "View Items" : "Closed"}
            </button>
          </div>
        </div>
      );
    })}
  </div>

  {/* Right Scroll Button */}
  <button
    className="px-2 py-2 h-[35px] rounded-full bg-white/10 backdrop-blur-md border border-white/30 shadow-md hover:bg-white/20 transition-all duration-300"
    onClick={() => handleScrollShop(shopsRef, "right")}
  >
    <FaChevronRight className="text-primary-600" />
  </button>
</div>

        )}

        {(!shopInCity || shopInCity.length === 0 || shopInCity[0]?.city !== city) && (
          <div className="w-full text-center py-12">
            <div className="text-gray-500 text-lg">No shops available in {city}</div>
            <p className="text-gray-400 text-sm mt-2">
              Please check back later or try a different location
            </p>
          </div>
        )}
      </div>

      {/* Best Items Section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold">
          Best Items In {city}
        </h1>
        {itemInCity?.length > 0 && itemInCity[0]?.shop?.city === city && (
          <div className="w-full h-auto flex flex-row flex-wrap justify-center gap-6">
            {itemInCity.map((item, index) => (
              <FoodCard data={item} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;

import React from "react";

function CategoryCard({ data }) {
  return (
    <div className="group relative w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-3xl shrink-0 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-lg hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 border border-white/50 cursor-pointer">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 z-10"></div>

      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

      {/* Image with enhanced effects */}
      <img
        src={data.image}
        alt={data.category}
        className="relative z-20 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      {/* Modern glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"></div>

      {/* Enhanced text label */}
      <div className="absolute bottom-0 left-0 right-0 z-40 p-4 md:p-5">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl px-3 py-2 md:px-4 md:py-3 border border-white/30 shadow-inner shadow-white/10 group-hover:shadow-lg group-hover:shadow-primary-200 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <p className="text-sm md:text-base font-semibold text-white drop-shadow-md text-center leading-tight tracking-wide">
            {data.category}
          </p>
        </div>
      </div>

      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out z-50"></div>
    </div>
  );
}

export default CategoryCard;

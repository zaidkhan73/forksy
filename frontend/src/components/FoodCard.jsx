import React, { useState } from 'react';
import { Star, StarHalf, Plus, Minus, Check, Flower2, UtensilsCrossed } from 'lucide-react';
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import {  useDispatch, useSelector } from 'react-redux';
import { setCartItems } from '../../redux/userSlice';


function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch()
  const {cartItems} = useSelector((state) => state.user)
  

  // Destructure data with fallbacks
  const {
    _id,
    name ,
    category ,
    foodType,
    image ,
    rating,
    shop,
    price ,
  } = data || {};

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

  const shopOpen = isShopCurrentlyOpen(shop);
  const isItemInCart = cartItems.some((item) => item.id === _id);

  const handleAddToCart = () => {
    if (quantity > 0 && shopOpen && !isItemInCart) {
      dispatch(setCartItems({
       id:_id,
       name:name,
       price:price,
       image:image,
       shop:shop._id,
       quantity:quantity,
       food_type:foodType
    }))
    }
  };

  const handleIncrement = () => {
    if (shopOpen) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0 && shopOpen) {
      setQuantity(prev => prev - 1);
    }
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    
    // Full stars
    for (let i = 1; i <= 5 ; i++) {
      stars.push(
        <span key={i}>
          {i <= rating ? 
            <FaStar className='text-yellow-500 text-lg' /> : 
            <FaRegStar className='text-yellow-500 text-lg' />
          }
        </span>
      );
    }

    return stars;
  };

  // Get food type styling
  const getFoodTypeStyle = () => {
    if (foodType.toLowerCase() === 'veg') {
      return {
        bgColor: 'bg-green-100',
        borderColor: 'border-green-500',
        textColor: 'text-green-700',
        icon: <Flower2 className="w-2 h-2" />
      };
    } else {
      return {
        bgColor: 'bg-red-100',
        borderColor: 'border-red-500',
        textColor: 'text-red-700',
        icon: <UtensilsCrossed className="w-2 h-2" />
      };
    }
  };

  const foodTypeStyle = getFoodTypeStyle();

  // Get button text and styling
  const getAddButtonProps = () => {
    if (!shopOpen) {
      return {
        text: "Shop Closed",
        className: "bg-gray-400 cursor-not-allowed text-gray-200",
        disabled: true
      };
    }
    if (isItemInCart) {
      return {
        text: "Added to Cart",
        className: "bg-green-600 cursor-not-allowed",
        disabled: true
      };
    }
    if (quantity === 0) {
      return {
        text: "Select Quantity",
        className: "bg-gray-400 cursor-not-allowed",
        disabled: true
      };
    }
    return {
      text: "Add to Cart",
      className: "bg-primary-600 hover:bg-primary-700 hover:shadow-md transform hover:scale-[1.02]",
      disabled: false
    };
  };

  const buttonProps = getAddButtonProps();

  return (
    <div className={`group relative bg-white/90 backdrop-blur-md border border-white/40 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col w-60 ${!shopOpen ? 'opacity-75' : ''}`}>

      {/* Shop Closed Overlay */}
      {!shopOpen && (
        <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
            Shop Closed
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative w-full h-36 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
        )}
        <img
          src={image || "https://via.placeholder.com/288x160?text=Food+Image"}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageError(true);
            e.target.src = "https://via.placeholder.com/288x160?text=Food+Image";
            setImageLoaded(true);
          }}
        />

        {/* Food Type Badge */}
        <div className="absolute top-1.5 left-1.5">
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border ${foodTypeStyle.bgColor} ${foodTypeStyle.borderColor} ${foodTypeStyle.textColor} backdrop-blur-sm`}>
            {foodTypeStyle.icon}
            <span className="text-[10px] font-semibold uppercase">{foodType}</span>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-white/50">
          <div className="flex items-center gap-1">
            <div className="flex">
              {renderStars(rating?.average)}
            </div>
            <span className="text-[10px] font-bold text-gray-800">{rating?.average}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div className="space-y-1.5">
          <div>
            <h3 className="text-base font-bold text-gray-800 group-hover:text-primary-700 transition-colors duration-300 line-clamp-1">
              {name}
            </h3>
            <p className="text-xs text-primary-600 font-medium capitalize">{category}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-600">
              <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
              <span className="text-[11px]">{shop.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${shopOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-[10px] font-medium ${shopOpen ? 'text-green-600' : 'text-red-600'}`}>
                {shopOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-800">₹{price}</span>
            {quantity > 0 && (
              <span className="text-xs font-semibold text-primary-600">
                = ₹{(price * quantity).toFixed(0)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <div className={`flex items-center gap-1 rounded-md p-0.5 transition-all duration-200 ${
            shopOpen ? 'bg-gray-100' : 'bg-gray-200'
          }`}>
            <button
              onClick={handleDecrement}
              disabled={!shopOpen || quantity === 0}
              className={`w-5 h-5 rounded bg-white shadow-sm border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                shopOpen && quantity > 0
                  ? 'text-gray-600 hover:text-red-600 hover:border-red-300 cursor-pointer' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center font-semibold text-xs text-gray-800">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={!shopOpen}
              className={`w-5 h-5 rounded bg-white shadow-sm border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                shopOpen 
                  ? 'text-gray-600 hover:text-green-600 hover:border-green-300 cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={buttonProps.disabled}
            className={`flex-1 px-2.5 py-1.5 rounded-md font-semibold text-xs text-white transition-all duration-300 ${buttonProps.className}`}
          >
            {isItemInCart && <Check className="w-3 h-3 inline mr-1" />}
            {buttonProps.text}
          </button>
        </div>
      </div>

      {/* Hover Glow Effect - Only when shop is open */}
      {shopOpen && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-700 via-purple-600 to-green-700 rounded-lg opacity-0 group-hover:opacity-10 blur transition-opacity duration-300 -z-10"></div>
      )}
    </div>
  );
}

export default FoodCard;
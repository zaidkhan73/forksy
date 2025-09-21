import React from 'react';
import { Plus, Minus, Trash2, ShoppingCart, Flower2, UtensilsCrossed } from 'lucide-react';
import { useSelector , useDispatch } from 'react-redux';
import { removeCartItems, updateQuantity } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";



function CartPage() {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);

  const handleIncrement = (item) => {
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1}))
  }

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
        dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1}))
    }
  }

  const handleRemoveItem = (item) => {
    dispatch(removeCartItems({ id: item.id}))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.length};

  const getFoodTypeStyle = (foodType) => {
    if (foodType === 'Veg') {
      return {
        bgColor: 'bg-green-100',
        borderColor: 'border-green-500',
        textColor: 'text-green-700',
        icon: <Flower2 className="w-3 h-3" />
      };
    } else {
      return {
        bgColor: 'bg-red-100',
        borderColor: 'border-red-500',
        textColor: 'text-red-700',
        icon: <UtensilsCrossed className="w-3 h-3" />
      };
    }
  };

  if (cartItems.length === 0) {
   return (
  <div className="min-h-screen bg-gradient-to-br from-sage-100 to-primary-100 p-4 flex items-center justify-center">
    <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-center gap-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="self-start mb-2 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
      >
        <FaArrowLeft className="w-5 h-5" />
      </button>

      {/* Cart Icon */}
      <ShoppingCart className="w-24 h-24 text-gray-300 mb-4" />

      {/* Text */}
      <h2 className="text-2xl font-bold text-gray-700 text-center">Your Cart is Empty</h2>
      <p className="text-gray-500 text-center">Add some delicious items to get started!</p>
      
    </div>
  </div>
);

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-100 to-primary-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <ShoppingCart className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-primary-900">Your Cart</h1>
                <p className="text-sm text-primary-600">
                  {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} • ₹{getTotalPrice()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-primary-600">₹{getTotalPrice()}</p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => {
            const foodTypeStyle = getFoodTypeStyle(item.food_type);
            
            return (
              <div key={item.id} className="group bg-white/90 backdrop-blur-md border border-white/40 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4">
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image || "https://via.placeholder.com/120x80?text=Food+Image"}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/120x80?text=Food+Image";
                      }}
                    />
                    {/* Food Type Badge */}
                    <div className="absolute -top-1 -right-1">
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border ${foodTypeStyle.bgColor} ${foodTypeStyle.borderColor} ${foodTypeStyle.textColor} backdrop-blur-sm`}>
                        {foodTypeStyle.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-800 truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="capitalize">{item.food_type}</span>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span>{item.shop}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">₹{item.price} each</span>
                          {item.quantity > 1 && (
                            <>
                              <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                              <span className="text-sm font-semibold text-primary-600">
                                ₹{(item.price * item.quantity)} total
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => handleDecrement(item)}
                            className="w-8 h-8 rounded-md bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors duration-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-semibold text-sm text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                          onClick={() => handleIncrement(item)}
                            className="w-8 h-8 rounded-md bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-green-600 transition-colors duration-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemoveItem(item)}
                          className="w-8 h-8 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-700 via-purple-600 to-green-700 rounded-xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-300 -z-10"></div>
              </div>
            );
          })}
        </div>

        {/* Checkout Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-primary-900 mb-1">Order Summary</h2>
              <p className="text-sm text-gray-600">
                {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-primary-600">₹{getTotalPrice()}</p>
              </div>
              <button className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
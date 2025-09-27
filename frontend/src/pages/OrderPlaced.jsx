import React from 'react'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function OrderPlaced() {
    const navigate = useNavigate()
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sage-100 to-primary-100 px-4 text-center relative overflow-hidden'>
            
            {/* Success Icon with animation */}
            <div className="relative mb-8">
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-30"></div>
              
              {/* Main success icon */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl">
                <Check className="w-12 h-12 text-white animate-bounce" strokeWidth={3} />
              </div>
              
              {/* Sparkle effects */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping delay-300"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-500"></div>
            </div>

            {/* Text Content */}
            <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Order Placed Successfully</h1>
            <p className='text-gray-700 text-sm md:text-base max-w-md'>
                Thank you for your purchase! Your order is being prepared. You can track your order status in the <span className="font-semibold">"My Orders"</span> section.
            </p>
            <button className='bg-primary-600 hover:bg-primary-800 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all' onClick={() => navigate('/my-orders')}>Back to my orders</button>
        </div>
    )
}

export default OrderPlaced

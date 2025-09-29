import React, { useEffect, useState, useRef } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import DeliveryBoyTracking from './DeliveryBoyTracking'





function DeliveryBoy() {
  const {userData} = useSelector(state => state.user)
  
  const [availableAssignments, setAvailableAssignments] = useState([])
  const [currentOrder, setCurrentOrder] = useState()
  const [showOtpBox, setShowOtpBox] = useState(false)
  
  // OTP State - single state with 4 digits
  const [otp, setOtp] = useState('')
  
  // Refs for OTP inputs
  const otp1Ref = useRef(null)
  const otp2Ref = useRef(null)
  const otp3Ref = useRef(null)
  const otp4Ref = useRef(null)
  
  const getAssignments = async () => {

    try {
      const res = await axios.get(`${serverUrl}/api/order/get-assignments`,{withCredentials:true})
      console.log("get assignment: ",res.data) 
      setAvailableAssignments(res.data)     
    } catch (error) {
      console.log(error)
    }
  }
  
  const getCurrentOrder = async () => {

    try {
      const res = await axios.get(`${serverUrl}/api/order/get-accepted-order`,{withCredentials:true})
      console.log("current order: ",res.data)
      setCurrentOrder(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleAccept = async (assignmentId) => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`,{withCredentials:true})
      console.log(res.data)
      setAvailableAssignments(prev => prev.filter(a => a.assignmentId !== assignmentId));
    } catch (error) {
      console.log(error)
    }
  }

  const handleOtpInput = (value, position, nextRef) => {
    const numValue = value.replace(/[^0-9]/g, '').slice(-1)
    
    if (numValue) {
      // Update the OTP at specific position
      const otpArray = otp.padEnd(4, ' ').split('')
      otpArray[position - 1] = numValue
      setOtp(otpArray.join('').replace(/ /g, ''))
      
      // Move to next input if exists
      if (nextRef) nextRef.current.focus()
    } else {
      // Handle deletion
      const otpArray = otp.padEnd(4, ' ').split('')
      otpArray[position - 1] = ''
      setOtp(otpArray.join('').replace(/ /g, ''))
    }
  }

  const handleKeyDown = (e, position, nextRef, prevRef) => {
    if (e.key === 'Backspace') {
      const currentDigit = otp[position - 1]
      
      if (!currentDigit && prevRef) {
        // If current is empty, move to previous and clear it
        const otpArray = otp.padEnd(4, ' ').split('')
        otpArray[position - 2] = ''
        setOtp(otpArray.join('').replace(/ /g, ''))
        prevRef.current.focus()
      } else {
        // Clear current digit
        const otpArray = otp.padEnd(4, ' ').split('')
        otpArray[position - 1] = ''
        setOtp(otpArray.join('').replace(/ /g, ''))
      }
    }
  }

  const resetOtp = () => {
    setOtp('')
  }

  const closeOtpPopup = () => {
    setShowOtpBox(false)
    resetOtp()
  }

  const handleSubmitOtp = () => {
    console.log('OTP submitted:', otp)
    // Add your OTP submission logic here - now you have the complete OTP in a single string
    closeOtpPopup()
  }

  const isOtpComplete = otp.length === 4

  useEffect(()=>{
    getAssignments()
    getCurrentOrder()
  },[userData])
  
  return (
    <div className='w-full bg-gradient-to-br from-sage-50 to-sage-100 min-h-screen py-5 flex flex-col items-center'>
      <Nav/>
      
      {/* Hero Section with User Info */}
      <div className='w-full max-w-6xl px-4 pt-6'>
        <div className='bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white relative overflow-hidden'>
          {/* Decorative circles - responsive sizes */}
          <div className='absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10 sm:-translate-y-14 sm:translate-x-14 lg:-translate-y-16 lg:translate-x-16'></div>
          <div className='absolute bottom-0 left-0 w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-white/10 rounded-full translate-y-8 -translate-x-8 sm:translate-y-9 sm:-translate-x-9 lg:translate-y-10 lg:-translate-x-10'></div>
          
          <div className='relative z-10'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              {/* User info section */}
              <div className='flex-1 min-w-0'>
                <h1 className='text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 leading-tight'>
                  Welcome back, <span className='block sm:inline'>{userData?.fullName}</span>
                </h1>
                
                {/* Location info - responsive layout */}
                <div className='flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-primary-100'>
                  <div className='flex items-center gap-1.5'>
                    <svg className='w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd'></path>
                    </svg>
                    <span className='text-xs sm:text-sm font-medium'>
                      Lat: {userData?.location?.coordinates[1]}
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <div className='w-1 h-1 bg-primary-200 rounded-full hidden xs:block'></div>
                    <span className='text-xs sm:text-sm font-medium'>
                      Lng: {userData?.location?.coordinates[0]}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Available counter - responsive */}
              {!currentOrder && <div className='bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center flex-shrink-0 self-start sm:self-auto'>
                <div className='text-xl sm:text-2xl lg:text-3xl font-bold leading-none'>
                  {availableAssignments?.length || 0}
                </div>
                <div className='text-xs sm:text-xs lg:text-sm text-primary-100 mt-1'>
                  Available
                </div>
              </div> }
              
            </div>
          </div>
        </div>

        {/* Orders Section */}
        {!currentOrder &&
        <div className='bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-6'>
        
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-bold text-primary-700 flex items-center gap-2'>
              <svg className='w-6 h-6 text-primary-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'></path>
              </svg>
              Available Orders
            </h2>
            <div className='bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium'>
              {availableAssignments?.length || 0} orders
            </div>
          </div>
          
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {availableAssignments && availableAssignments.length > 0 ? (
              availableAssignments.map((a, index) => (
                <div key={index} className='group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200 hover:border-primary-200 p-4 relative overflow-hidden'>
                  <div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-bl-2xl opacity-50'></div>
                  
                  <div className='relative z-10 space-y-3'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <h3 className='font-semibold text-primary-700 group-hover:text-primary-600 transition-colors'>
                          {a.shopName}
                        </h3>
                        <p className='text-sm text-neutral-600 mt-1 line-clamp-2'>
                          {a.deliveryAddress.text}
                        </p>
                      </div>
                    </div>
                    
                    <div className='flex items-center justify-between pt-2 border-t border-neutral-100'>
                      <div className='flex items-center gap-4 text-sm text-neutral-600'>
                        <div className='flex items-center gap-1'>
                          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'></path>
                          </svg>
                          <span>{a.items.length} items</span>
                        </div>
                        <div className='font-medium text-primary-600'>
                          ₹{a.subtotal}
                        </div>
                      </div>
                    </div>
                    
                    <button className='w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-[1.02] shadow-sm hover:shadow-md' onClick={()=>handleAccept(a.assignmentId)}>
                      Accept Order
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-full flex flex-col items-center justify-center py-12 text-center'>
                <div className='bg-neutral-100 rounded-full p-6 mb-4'>
                  <svg className='w-12 h-12 text-neutral-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'></path>
                  </svg>
                </div>
                <h3 className='text-lg font-medium text-neutral-700 mb-2'>No orders available</h3>
                <p className='text-neutral-500 text-sm max-w-sm'>
                  New delivery assignments will appear here when they become available in your area.
                </p>
              </div>
            )}
          </div>
        </div>  }

        {currentOrder && (
          <div className='bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-6 w-full relative overflow-hidden'>
            {/* Decorative elements */}
            <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cream-100 to-cream-200 rounded-full -translate-y-12 translate-x-12 opacity-60'></div>
            <div className='absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary-100 to-primary-200 rounded-full translate-y-8 -translate-x-8 opacity-40'></div>
            
            <div className='relative z-10'>
              {/* Header with status indicator */}
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-primary-700 flex items-center gap-3'>
                  <div className='bg-gradient-to-r from-cream-400 to-cream-500 p-2 rounded-xl shadow-sm'>
                    <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z'></path>
                    </svg>
                  </div>
                  Current Order
                </h2>
              </div>

              {/* Order Card */}
              <div className='bg-gradient-to-r from-white to-neutral-50 border border-neutral-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300'>
                {/* Card decorative element */}
                <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-sage-100 rounded-bl-3xl opacity-30'></div>
                
                <div className='relative z-10 space-y-4'>
                  {/* Shop info */}
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-2'>
                        <div className='w-2 h-2 bg-primary-500 rounded-full'></div>
                        <h3 className='font-bold text-primary-700 text-base'>
                          {currentOrder?.shopOrder.shop.name}
                        </h3>
                      </div>
                      
                      {/* Address with icon */}
                      <div className='flex items-start gap-2 mb-3'>
                        <svg className='w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd'></path>
                        </svg>
                        <p className='text-sm text-sage-600 leading-relaxed'>
                          {currentOrder.deliveryAddress.text}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order details */}
                  <div className='flex items-center justify-between pt-3 border-t border-neutral-100'>
                    <div className='flex items-center gap-4'>
                      {/* Items count */}
                      <div className='flex items-center gap-1.5 bg-sage-100 px-3 py-1.5 rounded-lg'>
                        <svg className='w-4 h-4 text-sage-600' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'></path>
                        </svg>
                        <span className='text-sm font-medium text-sage-700'>
                          {currentOrder.shopOrder.shopOrderItem.length} items
                        </span>
                      </div>
                      
                      {/* Subtotal */}
                      <div className='flex items-center gap-1.5 bg-primary-100 px-3 py-1.5 rounded-lg'>
                        <svg className='w-4 h-4 text-primary-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'></path>
                        </svg>
                        <span className='text-sm font-bold text-primary-700'>
                          ₹{currentOrder.shopOrder.subtotal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DeliveryBoyTracking data={currentOrder}/>
            
            <button 
              onClick={() => setShowOtpBox(true)}
              className='mt-4 w-full bg-primary-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-primary-600 active:scale-95 transition-all duration-300'
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>

      {/* OTP Popup */}
      {showOtpBox && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-8 w-full max-w-md mx-4 relative overflow-hidden'>
            {/* Decorative elements */}
            <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full -translate-y-10 translate-x-10 opacity-60'></div>
            
            <div className='relative z-10'>
              {/* Header */}
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                  <div className='bg-gradient-to-r from-cream-400 to-cream-500 p-2 rounded-xl shadow-sm'>
                    <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                    </svg>
                  </div>
                  <h3 className='text-lg sm:text-xl font-bold text-primary-700'>Verify OTP</h3>
                </div>
                <button 
                  onClick={closeOtpPopup}
                  className='p-2 hover:bg-neutral-100 rounded-full transition-colors'
                >
                  <svg className='w-5 h-5 text-neutral-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                  </svg>
                </button>
              </div>

              <p className='text-sm text-neutral-600 mb-8 text-center'>
                Enter the 4-digit OTP provided by the customer to confirm delivery
              </p>

              {/* OTP Input Fields */}
              <div className='flex justify-center gap-3 sm:gap-4 mb-8'>
                <input
                  ref={otp1Ref}
                  type='text'
                  inputMode='numeric'
                  maxLength='1'
                  value={otp[0] || ''}
                  onChange={(e) => handleOtpInput(e.target.value, 1, otp2Ref)}
                  onKeyDown={(e) => handleKeyDown(e, 1, otp2Ref)}
                  className='w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200 bg-neutral-50 focus:bg-white'
                />
                <input
                  ref={otp2Ref}
                  type='text'
                  inputMode='numeric'
                  maxLength='1'
                  value={otp[1] || ''}
                  onChange={(e) => handleOtpInput(e.target.value, 2, otp3Ref, otp1Ref)}
                  onKeyDown={(e) => handleKeyDown(e, 2, otp3Ref, otp1Ref)}
                  className='w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200 bg-neutral-50 focus:bg-white'
                />
                <input
                  ref={otp3Ref}
                  type='text'
                  inputMode='numeric'
                  maxLength='1'
                  value={otp[2] || ''}
                  onChange={(e) => handleOtpInput(e.target.value, 3, otp4Ref, otp2Ref)}
                  onKeyDown={(e) => handleKeyDown(e, 3, otp4Ref, otp2Ref)}
                  className='w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200 bg-neutral-50 focus:bg-white'
                />
                <input
                  ref={otp4Ref}
                  type='text'
                  inputMode='numeric'
                  maxLength='1'
                  value={otp[3] || ''}
                  onChange={(e) => handleOtpInput(e.target.value, 4, null, otp3Ref)}
                  onKeyDown={(e) => handleKeyDown(e, 4, null, otp3Ref)}
                  className='w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200 bg-neutral-50 focus:bg-white'
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitOtp}
                disabled={!isOtpComplete}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                  isOtpComplete 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg active:scale-95' 
                    : 'bg-neutral-300 cursor-not-allowed'
                }`}
              >
                Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeliveryBoy
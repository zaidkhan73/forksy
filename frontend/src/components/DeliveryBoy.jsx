import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'



function DeliveryBoy() {
  const {userData} = useSelector((state)=>state.user)
  const [availableAssignments, setAvailableAssignments] = useState([])
  
  const getAssignments = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/get-assignments`,{withCredentials:true})
      console.log("get assignment: ",res.data) 
      setAvailableAssignments(res.data)     
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(()=>{
    getAssignments()
  },[userData])

  const handleAccept = async () => {
    try {
      const res = await axios.post(`${serverUrl}/api/order/accept-order`,{withCredentials:true})
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className='w-full bg-gradient-to-br from-sage-50 to-sage-100 min-h-screen flex flex-col items-center'>
      <Nav/>
      
      {/* Hero Section with User Info */}
      <div className='w-full max-w-6xl px-4 pt-6'>
        <div className='bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl shadow-lg p-6 mb-8 text-white relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
          <div className='absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10'></div>
          <div className='relative z-10'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold mb-2'>Welcome back, {userData?.fullName}</h1>
                <div className='flex items-center gap-4 text-primary-100'>
                  <div className='flex items-center gap-1'>
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd'></path>
                    </svg>
                    <span className='text-sm'>Lat: {userData?.location?.coordinates[1]}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='text-sm'>Lng: {userData?.location?.coordinates[0]}</span>
                  </div>
                </div>
              </div>
              <div className='bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center'>
                <div className='text-2xl font-bold'>{availableAssignments?.length || 0}</div>
                <div className='text-xs text-primary-100'>Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
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
                    
                    <button className='w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-[1.02] shadow-sm hover:shadow-md'>
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
        </div>
      </div>
    </div>
  )
}

export default DeliveryBoy
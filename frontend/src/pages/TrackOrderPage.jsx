import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'

function TrackOrderPage() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const [currentOrder, setCurrentOrder] = useState({
      deliveryAddress: {
        text: "123 Main Street, Sector 5, Mumbai",
        latitude: 19.0760,
        longitude: 72.8777
      },
      shopOrders: [
        {
          shop: { name: "Pizza Palace" },
          shopOrderItem: [
            { item: { name: "Margherita Pizza" }},
            { item: { name: "Pepsi" }}
          ],
          subtotal: 450,
          status: "out_for_delivery",
          assignedDeliveryBoy: {
            fullName: "John Doe",
            mobile: "+91 9876543210",
            location: {
              coordinates: [72.8777, 19.0760]
            }
          }
        },
        {
          shop: { name: "Burger Hub" },
          shopOrderItem: [
            { item: { name: "Classic Burger" }},
            { item: { name: "French Fries" }}
          ],
          subtotal: 320,
          status: "delivered",
          assignedDeliveryBoy: null
        }
      ]
    })

    const handleGetOrder = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`,{withCredentials:true})
            console.log("track order by Id: ",res.data)
            setCurrentOrder(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getStatusColor = (status) => {
      switch(status) {
        case 'delivered': return 'bg-primary-100 text-primary-700 border-primary-200'
        case 'out_for_delivery': return 'bg-cream-100 text-cream-700 border-cream-200'
        case 'preparing': return 'bg-sage-100 text-sage-700 border-sage-200'
        default: return 'bg-neutral-100 text-neutral-700 border-neutral-200'
      }
    }

    const getStatusIcon = (status) => {
      switch(status) {
        case 'delivered': 
          return (
            <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd'></path>
            </svg>
          )
        case 'out_for_delivery':
          return (
            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z'></path>
            </svg>
          )
        default:
          return (
            <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd'></path>
            </svg>
          )
      }
    }

    useEffect(()=>{
        handleGetOrder()
    },[orderId])

    return (
        <div className='min-h-screen bg-gradient-to-br from-sage-50 to-neutral-50 py-3 px-3'>
          <div className='max-w-3xl mx-auto'>
            {/* Header - Compact */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-3 sm:p-4 mb-4 sticky top-3 z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigate("/my-orders")}
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 hover:bg-primary-200 rounded-lg transition-all duration-200 group"
                >
                  <svg className='w-4 h-4 sm:w-5 sm:h-5 text-primary-600 group-hover:text-primary-700 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7'></path>
                  </svg>
                </button>
                <div className='flex-1 min-w-0'>
                  <h1 className='text-lg sm:text-xl font-bold text-primary-700 truncate'>Track Order</h1>
                  <p className='text-xs text-sage-600'>ID: #{orderId}</p>
                </div>
                <div className='bg-gradient-to-r from-primary-500 to-primary-600 px-2.5 py-1 rounded-lg text-white text-xs font-medium'>
                  {currentOrder?.shopOrders?.length || 0}
                </div>
              </div>
            </div>

            {/* Delivery Address - Compact */}
            <div className='bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-3 sm:p-4 mb-4'>
              <div className='flex items-start gap-2.5'>
                <div className='bg-sage-100 p-1.5 rounded-lg flex-shrink-0'>
                  <svg className='w-4 h-4 text-sage-600' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd'></path>
                  </svg>
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-primary-700 text-sm mb-0.5'>Delivery Address</h3>
                  <p className='text-xs text-sage-600 leading-relaxed'>{currentOrder?.deliveryAddress?.text}</p>
                </div>
              </div>
            </div>

            {/* Shop Orders - Compact */}
            <div className='space-y-3'>
              {currentOrder?.shopOrders?.map((shopOrder, index) => (
                <div key={index} className='bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 overflow-hidden'>
                  {/* Shop Header - Compact */}
                  <div className='bg-gradient-to-r from-primary-500 to-primary-600 p-3 sm:p-4 text-white relative overflow-hidden'>
                    <div className='absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8'></div>
                    <div className='relative z-10'>
                      <div className='flex items-center justify-between flex-wrap gap-1.5'>
                        <div className='flex items-center gap-2'>
                          <div className='bg-white/20 p-1.5 rounded-lg'>
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                              <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'></path>
                            </svg>
                          </div>
                          <h2 className='text-base sm:text-lg font-bold'>{shopOrder.shop.name}</h2>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium ${getStatusColor(shopOrder.status)}`}>
                          {getStatusIcon(shopOrder.status)}
                          <span className='capitalize'>{shopOrder.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details - Compact */}
                  <div className='p-3 sm:p-4 space-y-3'>
                    {/* Items - Compact */}
                    <div className='bg-sage-50 rounded-lg p-3 border border-sage-100'>
                      <h4 className='font-semibold text-sage-700 text-sm mb-2 flex items-center gap-1.5'>
                        <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'></path>
                        </svg>
                        Items
                      </h4>
                      <div className='flex flex-wrap gap-1.5'>
                        {shopOrder.shopOrderItem.map((orderItem, idx) => (
                          <span key={idx} className='bg-white px-2 py-1 rounded-md text-xs font-medium text-sage-700 border border-sage-200'>
                            {orderItem.item.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Subtotal - Compact */}
                    <div className='flex items-center justify-between p-3 bg-cream-50 rounded-lg border border-cream-100'>
                      <div className='flex items-center gap-1.5'>
                        <svg className='w-4 h-4 text-cream-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'></path>
                        </svg>
                        <span className='font-semibold text-cream-700 text-sm'>Subtotal</span>
                      </div>
                      <span className='text-base font-bold text-cream-700'>₹{shopOrder.subtotal}</span>
                    </div>

                    {/* Delivery Status - Compact */}
                    {shopOrder.status !== "delivered" ? (
                      <div className='bg-neutral-50 rounded-lg p-3 border border-neutral-200'>
                        <div className='flex items-start gap-2.5'>
                          <div className='bg-primary-100 p-1.5 rounded-lg flex-shrink-0'>
                            <svg className='w-4 h-4 text-primary-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
                            </svg>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-semibold text-primary-700 text-sm mb-1.5'>Delivery Partner</h4>
                            {shopOrder.assignedDeliveryBoy ? (
                              <div className='space-y-2'>
                                <div className='flex flex-col xs:flex-row xs:items-center gap-1'>
                                  <span className='font-medium text-primary-600 text-sm'>{shopOrder.assignedDeliveryBoy.fullName}</span>
                                  <span className='text-xs text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded w-fit'>
                                    {shopOrder.assignedDeliveryBoy.mobile}
                                  </span>
                                </div>
                                {/* Live Tracking */}
                                <DeliveryBoyTracking data={{
                                  deliveryBoyLocation: {
                                    lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                                    lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
                                  },
                                  customerLocation: {
                                    lat: currentOrder.deliveryAddress.latitude,
                                    lon: currentOrder.deliveryAddress.longitude
                                  }
                                }} />
                              </div>
                            ) : (
                              <div className='flex items-center gap-1.5 text-neutral-600'>
                                <div className='w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse'></div>
                                <span className='text-xs'>Assigning delivery partner...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='bg-primary-50 rounded-lg p-3 border border-primary-200 text-center'>
                        <div className='flex items-center justify-center gap-1.5 text-primary-700'>
                          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd'></path>
                          </svg>
                          <span className='font-semibold text-base'>Order Delivered Successfully!</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    )
}

export default TrackOrderPage
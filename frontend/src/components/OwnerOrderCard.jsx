
import { Clock, MapPin, Mail, Phone, User, ShoppingBag, CheckCircle, AlertCircle, Truck, ChefHat } from "lucide-react";
import axios from "axios";
import { serverUrl } from "../App";
import { setOrderStatus } from "../../redux/userSlice";
import {  useDispatch } from "react-redux";
import { useState } from "react";

function OwnerOrderCard({ order }) {
    
    const dispatch = useDispatch()
    const [availableBoys, setAvailableBoys] = useState([])
 
  if (!order || !order.shopOrders || order.shopOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No order data available</h3>
          <p className="text-gray-500">Please check back later for new orders.</p>
        </div>
      </div>
    );
  }

 

  const handleStatusChange = async(orderId,shopId,status) => {
    // const newStatus = e.target.value;
    // setStatus(newStatus);
    // console.log("Updated status to:", newStatus);
    try {
        const res = await axios.post(`${serverUrl}/api/order/set-status/${orderId}/${shopId}`,{status},{withCredentials:true}) 
        console.log(res.data)
    dispatch(setOrderStatus({ orderId, shopId, status }));
    setAvailableBoys(res.data.availableBoys)

    } catch (error) {
        console.log(error)
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: AlertCircle,
        bgColor: 'bg-amber-50'
      },
      preparing: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: ChefHat,
        bgColor: 'bg-blue-50'
      },
      'out for delivery': {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Truck,
        bgColor: 'bg-purple-50'
      },
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const statusConfig = getStatusConfig(order.shopOrders[0].status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className=" bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Customer Orders
            </h1>
          </div>
        </div>

        {/* Compact Orders */}
        <div className="space-y-4">
          {order.shopOrders.map((shopOrder, idx) => (
            <div
              key={shopOrder._id || idx}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Horizontal Layout */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Section - Order Info */}
                <div className="lg:w-1/3 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b lg:border-b-0 lg:border-r border-gray-200/50">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      #{order._id.slice(-6)}
                    </h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {shopOrder.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{order.user?.fullName || 'Customer'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{order.user?.mobile || 'N/A'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-600 text-xs line-clamp-2">{order.deliveryAddress.text}</span>
                    </div>
                  </div>
                </div>

                {/* Middle Section - Order Items */}
                <div className="lg:w-2/5 p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Order Items ({shopOrder.shopOrderItem.length})
                  </h4>
                  
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {shopOrder.shopOrderItem.map((orderItem, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {orderItem.quantity}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm text-gray-800 truncate">
                              {orderItem.item?.name || "Item"}
                            </div>
                            <div className="text-xs text-gray-500">₹{orderItem.price} each</div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-800 flex-shrink-0">
                          ₹{orderItem.price * orderItem.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Subtotal:</span>
                      <span className="text-lg font-bold text-gray-800">₹{shopOrder.subtotal}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Status & Total */}
                <div className="lg:w-1/4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t lg:border-t-0 lg:border-l border-gray-200/50">
                  <div className="space-y-4">
                    {/* Status Update */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Update Status
                      </label>
                      <select
                         value={shopOrder.status}          // make it controlled
  disabled={shopOrder.status === "out for delivery"}  
                        onChange={(e)=>{handleStatusChange(order._id,shopOrder.shop._id,e.target.value)}}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      >
                        <option value="">Change</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="preparing">👨‍🍳 Preparing</option>
                        <option value="out for delivery">🚚 Out for Delivery</option>
                      </select>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 text-white text-center">
                      <div className="text-xs text-green-100 mb-1">Total Amount</div>
                      <div className="text-2xl font-bold">₹{order.totalAmount}</div>
                      <div className="text-xs text-green-100 mt-1">
                        {order.paymentMethod?.toUpperCase() || 'COD'}
                      </div>
                    </div>
                    
                  </div>
                  
                </div>
                
              </div>
              <div className="p-2">
                        {shopOrder.status === 'out for delivery' && 
                        <div className="p-2 rounded-lg text-sm bg-primary-50">
                            {availableBoys.length>0 ?(
                                availableBoys.map((b,index)=>(
                                    <div key={index} className="text-gray-800">available delivery boys: {b.fullName}-{b.mobile}</div>
                                ))
                            ): shopOrder.assignedDeliveryBoy ? (
                                <div>order assigned to: {shopOrder.assignedDeliveryBoy.fullName}-{shopOrder.assignedDeliveryBoy.mobile}</div>
                            ) : (
                                <div>waiting for delivery boy to accept</div>
                            )}
                        </div>}
                    </div>
            </div>
            
          ))}
        </div>
      </div>
    </div>
  );
}

export default OwnerOrderCard;
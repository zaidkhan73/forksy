import React, { useState } from "react";
import { Clock, MapPin, Mail, Phone, User, ShoppingBag } from "lucide-react";

function OwnerOrderCard({ order }) {
  if (!order || !order.shopOrders || order.shopOrders.length === 0) {
    return <div>No order data available</div>;
  }

  const [status, setStatus] = useState(order.shopOrders[0].status || "pending");

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    // TODO: Call backend API to update status in DB
    console.log("Updated status to:", newStatus);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className=" bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Customer Orders
          </h1>
          <p className="text-gray-600 text-sm">
            Manage and track customer orders from your shop
          </p>
        </div>

        {/* Orders */}
        {order.shopOrders.map((shopOrder, idx) => (
          <div
            key={shopOrder._id || idx}
            className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
          >
            {/* Order Header */}
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  Order #{order._id.slice(-8)}
                </h3>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="flex items-center gap-1 max-w-xs">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {order.deliveryAddress.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="flex flex-col items-start md:items-end">
                <label className="text-xs text-gray-500 mb-1">
                  Order Status
                </label>
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none bg-gray-50"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="out-for-delivery">Out for Delivery</option>
                </select>
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-4">
              <div className="mb-3">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">
                  Customer Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-gray-500" />
                    <span>{order.user.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-500" />
                    <span className="truncate">{order.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gray-500" />
                    <span>{order.user.mobile}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="h-3.5 w-3.5 text-gray-600" />
                  <span className="font-medium text-gray-700 text-sm">
                    Order Items
                  </span>
                </div>
                <div className="space-y-1.5 text-sm">
                  {shopOrder.shopOrderItem.map((orderItem, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded">
                          {orderItem.quantity}x
                        </span>
                        <span className="text-gray-700">
                          {orderItem.item?.name || "Item"}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">
                        ₹{orderItem.price * orderItem.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 text-xs text-gray-600 flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{shopOrder.subtotal}</span>
                </div>
              </div>

              {/* Total Amount */}
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Total Amount:
          </span>
          <span className="text-lg font-bold text-gray-900">
            ₹{order.totalAmount}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OwnerOrderCard;

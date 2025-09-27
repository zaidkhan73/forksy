
import { Clock, MapPin, Star, ShoppingBag, Filter, Search } from "lucide-react";

function UserOrderCard({ order }) {

  if (!order.shopOrders || order.shopOrders.length === 0) {
    return <div>No order data available</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return "✅";
      case "pending":
        return "⏳";
      case "cancelled":
        return "❌";
      case "preparing":
        return "👨‍🍳";
      default:
        return "📋";
    }
  };

  // Format date properly
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Orders</h1>
          <p className="text-gray-600">Track and manage your food orders</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {order.shopOrders.map((shopOrder, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          shopOrder.status
                        )}`}
                      >
                        <span>{getStatusIcon(shopOrder.status)}</span>
                        {shopOrder.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(order.updatedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">
                          {order.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {shopOrder.shopOrderItem.length} item
                      {shopOrder.shopOrderItem.length > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="p-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-sm">
                    <img
                      src={shopOrder.shop.image}
                      className="w-full h-full object-cover rounded-xl"
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">
                        {shopOrder.shop.name}
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Open
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {order.deliveryAddress.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-700">
                      Order Items
                    </span>
                  </div>
                  <div className="space-y-2">
                    {shopOrder.shopOrderItem.map((orderItem, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
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
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                      <span>Subtotal</span>
                      <span>₹{shopOrder.subtotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Action Buttons */}
          <div className="mt-4 border-t border-gray-300 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Total Amount */}
            <div className="text-xl font-bold text-gray-800">
              Total: ₹{order.totalAmount}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Pending: Cancel + Track */}
              {order.shopOrders[0].status === "pending" && (
                <>
                  <button className="flex-1 md:flex-auto bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                    Cancel Order
                  </button>
                  <button className="flex-1 md:flex-auto bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                    Track Order
                  </button>
                </>
              )}

              {/* Preparing or Out-for-delivery: Track only */}
              {(order.shopOrders[0].status === "preparing" ||
                order.shopOrders[0].status === "out-for-delivery") && (
                <button className="flex-1 md:flex-auto bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                  Track Order
                </button>
              )}

              {/* Delivered: Rate only */}
              {order.shopOrders[0].status === "delivered" && (
                <button className="flex-1 md:flex-auto border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition-colors">
                  Rate Order
                </button>
              )}

              {/* Always show View Details */}
              <button className="flex-1 md:flex-auto px-6 py-2.5 border border-gray-300 bg-gray-50 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors">
                View Details
              </button>
            </div>
          </div>{" "}
        </div>

        {/* Empty State - uncomment if needed */}
        {/* 
                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}
                */}
      </div>
    </div>
  );
}

export default UserOrderCard;

import React from "react";
import { useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";

function MyOrders() {
  const navigate = useNavigate();
  const { userData, myOrders } = useSelector((state) => state.user);

  return (
    <div className="w-full min-h-screen flex justify-center bg-gradient-to-br from-sage-100 to-primary-100 px-4">
      <div className="w-full max-w-[800px] p-4">
        <div className="flex items-center gap-[20px] mb-6">
          <div className="z-[10] cursor-pointer " onClick={() => navigate("/")}>
            <FaArrowLeft size={35} className="text-primary-700" />
          </div>

          <h1 className="text-3xl font-bold text-start">My orders</h1>
        </div>
        <div className="space-y-6">
            {myOrders && myOrders.length > 0 ? (
    myOrders.map((order, index) =>
      userData?.role === "user" ? (
        <UserOrderCard key={index} order={order} />
      ) : userData?.role === "owner" ? (
        <OwnerOrderCard key={index} order={order} />
      ) : null
    )
  ) : (
    <p className="text-gray-500 text-center">No orders found</p>
  )}

        </div>
      </div>
    </div>
  );
}

export default MyOrders;

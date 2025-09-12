import React from "react";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function OwnerItemCard({ data }) {
    const navigate = useNavigate()
  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden w-full max-w-2xl border border-gray-200">
      {/* Image Section */}
      <div className="w-36 h-36 flex-shrink-0 bg-gray-50">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <h2 className="text-base font-semibold text-primary-600">
            {data.name}
          </h2>
          <p>
            <span className="font-medium text-gray-700">Category: </span>
            {data.category}
          </p>
          <p>
            <span className="font-medium text-gray-700">Food Type: </span>
            {data.foodType}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-primary-500 font-bold">{data.price}</div>
          <div className="flex items-center cursor-pointer gap-1">
            <div className="p-2 rounded-full hover:bg-primary-100 text-primary-500 transition-all duration-300 " onClick={()=>navigate(`/edit-item/${data._id}`)}>
              <FaPen  />        
            </div>
            <div className="p-2 rounded-full hover:bg-primary-100 text-primary-500 transition-all duration-300 ">
                <FaTrashAlt />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;

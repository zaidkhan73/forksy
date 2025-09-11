import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { setShopData } from "../../redux/ownerSlice";


function CreateEditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { shopData } = useSelector((state) => state.owner);
  const {city , state, address} = useSelector((state) => state.user);

  const [name, setName] = useState(shopData?.name || "");
  const [Address, setAddress] = useState(shopData?.address || address);
  const [City, setCity] = useState(shopData?.city || city);
  const [State, setState] = useState(shopData?.state || state);
  const [frontendImage, setFrontendImage] = useState(shopData?.image || null)
  const [backendImage, setBackendImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  const handlImage = async (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()  
    try {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("name", name)
        formData.append("address", Address)
        formData.append("city", City)
        formData.append("state", State)
        if(backendImage){
            formData.append("image", backendImage)
        }
        const res = await axios.post(`${serverUrl}/api/shop/create-edit-shop`, formData, {withCredentials:true})
        dispatch(setShopData(res.data))
        console.log(res.data)
    } catch (error) {
        console.log(error)
    } finally{
        setIsLoading(false)
        navigate("/")
    }
  }

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-sage-300 relative via-sage-200 to-sage-100 min-h-screen">
      <div className="absolute top-[20px] left-[20px] z-10 mb-[10px]">
        <IoArrowBack
          size={35}
          className="text-primary-600 cursor-pointer hover:text-primary-700"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 ">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-primary-600 w-16 h-16" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{shopData ? "Edit Shop" : "Add Shop"}</div>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" placeholder="Enter shop name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 border-neutral-400 focus:ring-primary-500 transition-all duration-300"
                onChange={(e)=>setName(e.target.value)} value={name} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop image</label>
                <input type="file" accept="image/*"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 border-neutral-400 focus:ring-primary-500 transition-all duration-300"
                onChange={handlImage}
                 />
                 {frontendImage && <div className="mt-4">
                    <img src={frontendImage} alt="" className="w-full h-48 object-cover rounded-lg"/>
                 </div> }
                 
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" placeholder="city"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 border-neutral-400 focus:ring-primary-500 transition-all duration-300"
                value={City} onChange={(e)=>setCity(e.target.value)} />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" placeholder="state"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 border-neutral-400 focus:ring-primary-500 transition-all duration-300" 
                value={State} onChange={(e)=>setState(e.target.value)}/>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" placeholder="Enter shop address"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 border-neutral-400 focus:ring-primary-500 transition-all duration-300" 
                value={Address} onChange={(e)=>setAddress(e.target.value)}/>
            </div>
            <button className={isLoading ? ` w-full text-white bg-primary-700 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-primary-800 transition-all duration-300 cursor-pointer` : `w-full text-white bg-primary-700 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-primary-800 transition-all duration-300 cursor-pointer`}
            >
                save
            </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEditShop;

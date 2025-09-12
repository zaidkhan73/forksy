import React, { useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { setShopData } from "../../redux/ownerSlice";
import { Listbox } from "@headlessui/react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { FaChevronDown, FaCheck } from "react-icons/fa";

// Custom Dropdown Component
const CustomDropdown = ({ value, onChange, options, placeholder, label }) => {
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const buttonRef = React.useRef(null);

  const handleButtonClick = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      // Estimate dropdown height (approximately 50px per item + padding)
      const estimatedDropdownHeight = Math.min(options.length * 50 + 16, 240); // max-h-60 = 240px
      
      // If not enough space below but enough space above, position upward
      if (spaceBelow < estimatedDropdownHeight && spaceAbove > estimatedDropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button 
              ref={buttonRef}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 border-neutral-400 focus:ring-primary-500 transition-all duration-300 bg-white text-left flex items-center justify-between hover:border-primary-300"
              onClick={handleButtonClick}
            >
              <span className={value ? "text-gray-900" : "text-gray-500"}>
                {value || placeholder}
              </span>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-gray-400 w-4 h-4" />
              </motion.div>
            </Listbox.Button>

            <AnimatePresence>
              {open && (
                <Listbox.Options 
                  className={`absolute z-10 w-full bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none ${
                    dropdownPosition === 'top' 
                      ? 'bottom-full mb-1' 
                      : 'top-full mt-1'
                  }`}
                >
                  <motion.div
                    initial={{ 
                      opacity: 0, 
                      y: dropdownPosition === 'top' ? 10 : -10 
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ 
                      opacity: 0, 
                      y: dropdownPosition === 'top' ? 10 : -10 
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {options.map((option, index) => (
                      <Listbox.Option
                        key={index}
                        value={option.value}
                        className={({ active, selected }) =>
                          `relative cursor-pointer select-none py-3 px-4 transition-all duration-200 ${
                            active
                              ? "bg-primary-50 text-primary-700"
                              : "text-gray-900"
                          } ${selected ? "bg-primary-100 text-primary-800 font-medium" : ""}`
                        }
                      >
                        {({ selected }) => (
                          <div className="flex items-center justify-between">
                            <span className={selected ? "font-medium" : "font-normal"}>
                              {option.label}
                            </span>
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <FaCheck className="w-4 h-4 text-primary-600" />
                              </motion.div>
                            )}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </motion.div>
                </Listbox.Options>
              )}
            </AnimatePresence>
          </div>
        )}
      </Listbox>
    </div>
  );
};

function EditItem() {
    const [currentItem , setCurrentItem] = useState(null)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {itemId} = useParams()
//  const { shopData } = useSelector((state) => state.owner);
 
  
  const [name, setName] = useState( "");
  const [price, setPrice] = useState( "");
  const [category, setCategory] = useState( "");
  const [foodType, setFoodType] = useState( "");
  
  const [frontendImage, setFrontendImage] = useState( null);
  const [backendImage, setBackendImage] = useState("");

 
  const categoryOptions = [
    { value: "Snacks", label: "Snacks" },
    { value: "Main Course", label: "Main Course" },
    { value: "Desserts", label: "Desserts" },
    { value: "Pizza", label: "Pizza" },
    { value: "Sandwiches", label: "Sandwiches" },
    { value: "South Indian", label: "South Indian" },
    { value: "North Indian", label: "North Indian" },
    { value: "Chinese", label: "Chinese" },
    { value: "Fast Food", label: "Fast Food" },
    { value: "Others", label: "Others" },
  ];

  const foodTypeOptions = [
    { value: "Veg", label: "Vegetarian" },
    { value: "Nonveg", label: "Non-Vegetarian" },
  ];

  const handlImage = async (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("foodType", foodType);
      console.log("form data: ",formData)
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const res = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formData, {
        withCredentials: true,
      });
      dispatch(setShopData(res.data));
      console.log(res.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    } 
  };

  useEffect(()=>{
    const handleGetItemById = async () =>{
        try {
            const res = await axios.get(`${serverUrl}/api/item/item/${itemId}`,{withCredentials:true})
            console.log(res.data)
            setCurrentItem(res.data)
            
        } catch (error) {
            console.log(error)
        }
    }
    handleGetItemById()
  },[itemId])

  useEffect(() => {
  if (currentItem) {
    setName(currentItem.name || "");
    setPrice(currentItem.price || "");
    setCategory(currentItem.category || "");
    setFoodType(currentItem.foodType || "");
    setFrontendImage(currentItem.image || null);
  }
}, [currentItem]);

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-sage-300 relative via-sage-200 to-sage-100 min-h-screen">
      <div className="absolute top-[20px] left-[20px] z-10 mb-[10px]">
        <IoArrowBack
          size={35}
          className="text-primary-600 cursor-pointer hover:text-primary-700 transition-colors duration-300"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-primary-600 w-16 h-16" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">Edit food item</div>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter food item name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 border-neutral-400 focus:ring-primary-500 transition-all duration-300"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 border-neutral-400 focus:ring-primary-500 transition-all duration-300"
              onChange={handlImage}
            />
            {frontendImage && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={frontendImage}
                  alt="Food preview"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </motion.div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 border-neutral-400 focus:ring-primary-500 transition-all duration-300"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>
          
          <CustomDropdown
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            placeholder="Select category"
            label="Select category"
          />
          
          <CustomDropdown
            value={foodType}
            onChange={setFoodType}
            options={foodTypeOptions}
            placeholder="Select food type"
            label="Select food type"
          />
          
          <motion.button
            className="w-full text-white bg-primary-700 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-primary-800 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            Save
          </motion.button>
        </form>
      </div>
    </div>
  );
}

export default EditItem;
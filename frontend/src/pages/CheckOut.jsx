import React, {useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Banknote,
  Shield,
  Truck,
  Clock,
  CheckCircle,
  Search,
  Navigation,
} from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLocation, setMapAddress } from "../../redux/mapSlice";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { serverUrl } from "../App";

function RecenterMap({location}){
  if(location.lat && location.lon){
 const map = useMap()
  map.setView([location.lat,location.lon],16,{animate:true})
  return null
  }
 
}




function Checkout() {
const apikey = import.meta.env.VITE_GEOAPIKEY
  const { cartItems } = useSelector((state) => state.user);
  const { mapAddress } = useSelector((state) => state.map);
  const { location } = useSelector((state) => state.map);
  const dispatch = useDispatch()
  console.log(mapAddress);
  console.log("Map location:", location);

  
  


  //   // Sample cart items data - replace with your actual data source
  //   const cartItems = [
  //     {
  //       id: '1',
  //       name: 'Paneer Sandwich',
  //       image: 'https://via.placeholder.com/80x80?text=Food',
  //       price: 30,
  //       quantity: 2
  //     },
  //     {
  //       id: '2',
  //       name: 'Burger',
  //       image: 'https://via.placeholder.com/80x80?text=Food',
  //       price: 399,
  //       quantity: 1
  //     }
  //   ];

  const [selectedPayment, setSelectedPayment] = useState("cod");
  //const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [addresInput, setAddressInput] = useState("")

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 500 ? 0 : 40; // Free delivery over ₹500
  const gstRate = 0.18;
  const gst = Math.round(subtotal * gstRate);
  const total = subtotal + deliveryFee + gst;

  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: <Banknote className="w-5 h-5" />,
      color: "green",
    },
    {
      id: "upi",
      name: "UPI / Credit / Debit Card",
      description: "Secure online payment",
      icon: <CreditCard className="w-5 h-5" />,
      color: "blue",
    },
  ];

  

  //   const handleCurrentLocation = () => {
  //     setIsLocationLoading(true);
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           // Simulate reverse geocoding
  //           setTimeout(() => {
  //             //setDeliveryAddress(`Current Location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}\nFetched from device GPS`);
  //             setIsLocationLoading(false);
  //           }, 1500);
  //         },
  //         (error) => {
  //           alert('Location access denied or unavailable',error);
  //           setIsLocationLoading(false);
  //         }
  //       );
  //     } else {
  //       alert('Geolocation is not supported by this browser');
  //       setIsLocationLoading(false);
  //     }
  //   };

  const onDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    dispatch(setLocation({lat,lon:lng}))
    getAddressByLatLng(lat,lng)
  }

  const getCurrentLocation = () => {
  setIsLocationLoading(true)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async(position)=>{
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        dispatch(setLocation({lat,lon}))
        getAddressByLatLng(lat,lon)
      },
    )
}
setIsLocationLoading(false)
}

  const getAddressByLatLng = async (lat, lon) => {
  try {
    setIsLocationLoading(true)
    const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apikey}`
    );
    const address = res?.data?.results[0]?.formatted
    dispatch(setMapAddress(address))
    console.log(res)
  } catch (error) {
    console.log(error);
  } finally {
    setIsLocationLoading(false)
  }
}

const getLatLngByAddress = async () => {
   try {
    const res = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addresInput)}&apiKey=${apikey}`)
    console.log("latitude: ",res?.data?.features[0]?.properties.lat)
    console.log("longitude: ",res?.data?.features[0]?.properties.lon)
    const lat = res?.data?.features[0]?.properties.lat
    const lon = res?.data?.features[0]?.properties.lon
    dispatch(setLocation({lat,lon}))
   } catch (error) {
    console.log(error)
   }
}

const handlePlaceOrder = async () => {
  try {
    setIsLoading(true);
    const res = axios.post(`${serverUrl}/api/order/place-order`,{withCredentials:true})
    console.log(res)
  } catch (error) {
    console.log(error)
  } finally{
    setIsLoading(false)
  }
}

useEffect(()=>{
  setAddressInput(mapAddress)
},[mapAddress])



  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-100 to-primary-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg text-gray-600 hover:text-gray-800 transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
            <p className="text-sm text-gray-600">Complete your order</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Location */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Delivery Location
                </h2>
              </div>

              {/* Address Input Row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={addresInput}
                    onChange={(e)=>setAddressInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200 text-sm pr-20"
                    placeholder="Enter your delivery address"
                  />
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                <button
                  onClick={getLatLngByAddress}
                  className="px-3 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center min-w-[44px]"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  onClick={getCurrentLocation}
                  className="px-3 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center min-w-[44px] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                   {isLocationLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : ( 
                  <Navigation className="w-4 h-4" />
                   )} 
                </button>
              </div>

              {/* Interactive Map Placeholder */}
              <div className=" rounded-xl border-2 border-dashed border-gray-300 overflow-hidden">
                <div className="h-56 w-full flex items-center justify-center">
                  <MapContainer
                  zoom={15}
                  className="w-full h-full"
                  center={[location.lat, location.lon]}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <RecenterMap location={location}/>
                  <Marker position={[location.lat, location.lon]} draggable eventHandlers={{dragend:onDragEnd}}>
                    <Popup>
                      Delivery Location: {mapAddress}
                    </Popup>
                  </Marker>
                </MapContainer>

                </div>
                
                {/* <div className="relative z-10 text-center">
                  <MapPin className="w-12 h-12 text-primary-500 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-500">Your delivery location will appear here</p>
                </div> */}

                {/* Sample location pin */}
                {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div> */}
              </div>

              <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>
                  Delivery available in this area • Estimated time: 30-45 mins
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedPayment === method.id
                        ? `border-${method.color}-400 bg-${method.color}-50 shadow-lg`
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                          selectedPayment === method.id
                            ? `border-${method.color}-500 bg-${method.color}-500`
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPayment === method.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div
                        className={`p-2 rounded-lg ${
                          selectedPayment === method.id
                            ? `bg-${method.color}-100`
                            : "bg-gray-100"
                        }`}
                      >
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {method.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-800">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee === 0 ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Free delivery on orders above ₹500</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <span>Free delivery on orders above ₹500</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-gray-800 mt-4 mb-6">
                <span>Total</span>
                <span className="text-xl text-primary-600">₹{total}</span>
              </div>

              {/* Delivery Info */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Estimated Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>30-45 minutes</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading || cartItems.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isLoading || cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Placing Order...</span>
                  </div>
                ) : (
                  `Place Order • ₹${total}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing your order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

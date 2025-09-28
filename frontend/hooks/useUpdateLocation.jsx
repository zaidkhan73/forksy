import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { serverUrl } from "../src/App";

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);
  //const dispatch = useDispatch();

  useEffect(() => {
    const updateLocation = async (lat,lon) => {
        try {
            const res = await axios.post(`${serverUrl}/api/user/update-location`,{lat,lon},{withCredentials:true})
            console.log("user location: ",res)
        } catch (error) {
            console.log(error)
        }
    }

    navigator.geolocation.watchPosition((pos)=>{
        updateLocation(pos.coords.latitude,pos.coords.longitude)
    })
  }, [userData]);
  // useEffect(() => {
  //   const savedCity = localStorage.getItem("city")
  //   const savedLat = localStorage.getItem("latitude")
  //   const savedLon = localStorage.getItem("longitude")

  //   // STEP 1: Agar purana data hai toh load kar
  //   if (savedCity && savedLat && savedLon) {
  //     dispatch(setCity(savedCity))
  //     dispatch(setState(localStorage.getItem("state")))
  //     const savedAddress = localStorage.getItem("address")
  //     dispatch(setAddress(savedAddress))
  //     dispatch(setMapAddress(savedAddress))
  //     dispatch(setLocation({ lat: parseFloat(savedLat), lon: parseFloat(savedLon) }))
  //   }

  //   // STEP 2: Hamesha fresh location fetch karo
  //   navigator.geolocation.getCurrentPosition(async (position) => {
  //     const latitude = position.coords.latitude;
  //     const longitude = position.coords.longitude;
  //     console.log("Fresh Geo Coords:", latitude, longitude);

  //     dispatch(setLocation({ lat: latitude, lon: longitude }))

  //     const res = await axios.get(
  //       `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`
  //     );

  //     const city = res?.data?.results[0]?.city
  //     const state = res?.data?.results[0]?.state
  //     const address = res?.data?.results[0]?.formatted

  //     dispatch(setCity(city))
  //     dispatch(setState(state))
  //     dispatch(setAddress(address))
  //     dispatch(setMapAddress(address))

  //     // LocalStorage update
  //     localStorage.setItem("city", city)
  //     localStorage.setItem("state", state)
  //     localStorage.setItem("address", address)
  //     localStorage.setItem("latitude", latitude)
  //     localStorage.setItem("longitude", longitude)
  //   });
  // }, []);
}

export default useUpdateLocation;

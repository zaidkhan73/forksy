
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAddress, setCity, setState } from '../redux/userSlice'

function useGetCity() {
const apikey = import.meta.env.VITE_GEOAPIKEY
const dispatch = useDispatch()
 useEffect(() => {
  const savedCity = localStorage.getItem("city")
  if (savedCity) {
    dispatch(setCity(savedCity))
    dispatch(setState(localStorage.getItem("state")))
    dispatch(setAddress(localStorage.getItem("address")))
    return
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const res = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`
    );

    const city = res?.data?.results[0]?.city
    const state = res?.data?.results[0]?.state
    const address = res?.data?.results[0]?.formatted

    dispatch(setCity(city))
    dispatch(setState(state))
    dispatch(setAddress(address))

    localStorage.setItem("city", city)
    localStorage.setItem("state", state)
    localStorage.setItem("address", address)
  });
}, []);

  
}

export default useGetCity

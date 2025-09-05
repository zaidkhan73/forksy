
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCity } from '../redux/userSlice'

function useGetCity() {
const apikey = import.meta.env.VITE_GEOAPIKEY
const dispatch = useDispatch()
const {userData} = useSelector(state=>state.user)
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(async (position)=>{
      
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      const res = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`)
      console.log(res.data.results[0].city)
      dispatch(setCity(res?.data?.results[0].city))
    })
  },[userData])
  
}

export default useGetCity

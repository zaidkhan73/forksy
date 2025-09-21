// hooks/useGetCurrentUser.jsx
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../src/App'
import { useDispatch, useSelector } from 'react-redux'
import { setShopInCity } from '../redux/userSlice'


function useGetShopByCity() {
  const dispatch = useDispatch()

  const {city} = useSelector(state=>state.user)
  
  useEffect(() => {
    
    
      const fetchShops = async () => {
        try {
          const res = await axios.get(`${serverUrl}/api/shop/get-by-city/${city}`, {withCredentials: true})
          dispatch(setShopInCity(res.data))
          console.log(res.data)
        } catch (error) {
          console.log('Failed to fetch current user:', error)
          // If the request fails (e.g., user is not authenticated), 
          // ensure userData remains null
          dispatch(setShopInCity(null))
        }
      
      
    }
    fetchShops()
  }, [city, dispatch]) // Add dependencies
}

export default useGetShopByCity
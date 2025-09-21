import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../src/App'
import { setItemInCity } from '../redux/userSlice'

function useGetItemByCity() {
    const dispatch = useDispatch()
    const {city} = useSelector(state=>state.user)
   useEffect(() => {
  if (!city) return;  // <---- city aane se pehle request mat karo
  console.log("city",city)
  const fetchShops = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/item/get-by-city/${city}`, {withCredentials: true})
      dispatch(setItemInCity(res.data))
      console.log(res.data)
    } catch (error) {
      console.log('Failed to fetch items by city:', error)
      dispatch(setItemInCity([])) // null ke bajaye empty array bhejo
    }
  }

  fetchShops()
}, [city, dispatch])

}

export default useGetItemByCity

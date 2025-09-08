// hooks/useGetCurrentUser.jsx
import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../src/App'
import { useDispatch, useSelector } from 'react-redux'
import { setShopData } from '../redux/ownerSlice'

function useGetMyShop() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  
  useEffect(() => {
    // Only fetch user if we don't already have userData
    // This prevents the hook from running after logout
    if (!userData) {
      const fetchShop = async () => {
        try {
          const res = await axios.get(`${serverUrl}/api/shop/get-shop`, {withCredentials: true})
          dispatch(setShopData(res.data))
          console.log(res.data)
        } catch (error) {
          console.log('Failed to fetch current user:', error)
          // If the request fails (e.g., user is not authenticated), 
          // ensure userData remains null
          dispatch(setShopData(null))
        }
      }
      fetchShop()
    }
  }, [userData, dispatch]) // Add dependencies
}

export default useGetMyShop
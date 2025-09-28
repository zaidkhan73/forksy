// hooks/useGetCurrentUser.jsx
import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../src/App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders } from '../redux/userSlice'

function useGetMyOrders() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  
  useEffect(() => {
    // Only fetch user if we don't already have userData
    // This prevents the hook from running after logout
    
      const fetchOrder = async () => {
        try {
          const res = await axios.get(`${serverUrl}/api/order/get-order`, {withCredentials: true})
          dispatch(setMyOrders(res.data))
          console.log("My orders: ",res.data)
        } catch (error) {
          console.log('Failed to fetch current user:', error)
          // If the request fails (e.g., user is not authenticated), 
          // ensure userData remains null
          
        }
      }
      fetchOrder()
    
        
  }, [userData]) // Add dependencies
}

export default useGetMyOrders
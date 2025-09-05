// hooks/useGetCurrentUser.jsx
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../src/App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function useGetCurrentUser() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  
  useEffect(() => {
    // Only fetch user if we don't already have userData
    // This prevents the hook from running after logout
    if (!userData) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${serverUrl}/api/user/current`, {withCredentials: true})
          dispatch(setUserData(res.data))
          console.log(res.data)
        } catch (error) {
          console.log('Failed to fetch current user:', error)
          // If the request fails (e.g., user is not authenticated), 
          // ensure userData remains null
          dispatch(setUserData(null))
        }
      }
      fetchUser()
    }
  }, [userData, dispatch]) // Add dependencies
}

export default useGetCurrentUser
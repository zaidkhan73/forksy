import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../src/App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function useGetCurrentUser() {

  const dispatch = useDispatch()
  useEffect(()=>{
    const fetchUser = async () =>{
        try {
            const res = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            dispatch(setUserData(res.data))
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }
    fetchUser()
  },[])
}

export default useGetCurrentUser

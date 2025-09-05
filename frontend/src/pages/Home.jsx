import React from 'react'
import UserDashboard from '../components/UserDashboard'
import { useSelector } from 'react-redux'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'

function Home() {
    const {userData} = useSelector(state=>state.user)
  return (
    <div className='w-[100vw] min-h-screen pt-[100px] flex flex-col items-center bg-sage-50'>
      {userData.role==="user" && <UserDashboard/>}
      {userData.role==="owner" && <OwnerDashboard/>}
      {userData.role==="deliveryBoy" && <DeliveryBoy/>}
    </div>
  )
}

export default Home

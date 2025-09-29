import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from '../hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from '../hooks/useGetCity'
import useGetMyShop from '../hooks/useGetMyShop'
import CreateEditShop from './pages/createEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import useGetShopByCity from '../hooks/useGetShopByCity'
import useGetItemByCity from '../hooks/useGetItemByCity'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import useGetMyOrders from '../hooks/useGetMyOrders'
import useUpdateLocation from '../hooks/useUpdateLocation'
import TrackOrderPage from './pages/TrackOrderPage'

export const serverUrl = 'http://localhost:8000'

function App() {
  const {userData} = useSelector(state=>state.user)
  useGetMyOrders()
  useUpdateLocation()
  useGetCurrentUser()
  useGetItemByCity()
  useGetCity()
  useGetMyShop()
  useGetShopByCity()
  
  
  
  return (
    <Routes>
      <Route path='/signup'  element={!userData ? <SignUp/> : <Navigate to={"/"}/>}/>
      <Route path='/signin'  element={!userData ? <SignIn/> : <Navigate to={"/"}/>}/>
      <Route path='/forgotPassword'  element={!userData ? <ForgotPassword/> : <Navigate to={"/"}/>}/>
      <Route path='/'  element={userData ? <Home/> : <Navigate to={"/signin"}/>}/>
      <Route path='/create-edit-shop'  element={userData ? <CreateEditShop/> : <Navigate to={"/signin"}/>}/>
      <Route path='/add-item'  element={userData ? <AddItem/> : <Navigate to={"/signin"}/>}/>
      <Route path='/edit-item/:itemId'  element={userData ? <EditItem/> : <Navigate to={"/signin"}/>}/>
      <Route path='/cart'  element={userData ? <CartPage/> : <Navigate to={"/signin"}/>}/>
      <Route path='/checkout'  element={userData ? <CheckOut/> : <Navigate to={"/signin"}/>}/>
      <Route path='/order-placed'  element={userData ? <OrderPlaced/> : <Navigate to={"/signin"}/>}/>
      <Route path='/my-orders'  element={userData ? <MyOrders/> : <Navigate to={"/signin"}/>}/>
      <Route path='/track-order/:orderId'  element={userData ? <TrackOrderPage/> : <Navigate to={"/signin"}/>}/>
    </Routes>
  )
}

export default App

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

export const serverUrl = 'http://localhost:8000'

function App() {
  useGetCurrentUser()
  useGetCity()
  useGetMyShop()
  const {userData} = useSelector(state=>state.user)
  return (
    <Routes>
      <Route path='/signup'  element={!userData ? <SignUp/> : <Navigate to={"/"}/>}/>
      <Route path='/signin'  element={!userData ? <SignIn/> : <Navigate to={"/"}/>}/>
      <Route path='/forgotPassword'  element={!userData ? <ForgotPassword/> : <Navigate to={"/"}/>}/>
      <Route path='/'  element={userData ? <Home/> : <Navigate to={"/signin"}/>}/>
      <Route path='/create-edit-shop'  element={userData ? <CreateEditShop/> : <Navigate to={"/signin"}/>}/>
      <Route path='/add-item'  element={userData ? <AddItem/> : <Navigate to={"/signin"}/>}/>
    </Routes>
  )
}

export default App

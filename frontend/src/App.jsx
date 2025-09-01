import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'


export const severUrl = 'http://localhost:8000'

function App() {
  return (
    <Routes>
      <Route path='/signup'  element={<SignUp/>}/>
      <Route path='/signin'  element={<SignIn/>}/>
      <Route path='/forgotPassword'  element={<ForgotPassword/>}/>
    </Routes>
  )
}

export default App

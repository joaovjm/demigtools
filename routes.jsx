import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './src/pages/Home'
import Login from './src/pages/Login'
import Pages404 from './src/pages/Pages404'
import Navbar from './src/components/Navbar'
import Footer from './src/components/Footer'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='*' element={<Pages404/>}/>
        </Routes> 

      <Footer/>         

    </BrowserRouter>
  )
}

export default AppRoutes
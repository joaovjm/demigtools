import React from 'react'
import './index.css'
import { Link } from 'react-router';

import { IoEnterOutline } from "react-icons/io5";


const Navbar = () => {
  return (
    <nav>
        <Link to="/" className='logo'>Logo</Link>
        <Link to="/login" className='botao'><IoEnterOutline />Entrar</Link>
    </nav>
  )
}

export default Navbar
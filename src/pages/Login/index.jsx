import React from 'react'
import './index.css'
import { Link } from 'react-router'

const Login = () => {
  return (
    <section className='tela-login'>
      <div className='login-container'>
        <h3>Login</h3>
        <p>Use sua conta para fazer Login</p>
        <div className='login-box'>
            <input type="text" placeholder='Usuário' />
            <input type="password" placeholder='Senha'/>
        </div>

        <button>Log In</button>
        

      </div>
    </section>
    
  )
}

export default Login
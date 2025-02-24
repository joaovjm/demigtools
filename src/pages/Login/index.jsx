import React, { useState } from "react";
import './login.css'
import { FaEye, FaEyeSlash, FaRegUser } from "react-icons/fa";


const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   try{ 
  //     const response = await axios.get("http://localhost:3001/username", {
  //       username,
  //       password
  //     });

  //     if(response.data.token) {
  //       localStorage.setItem('token', response.data.token);
  //       onLogin();
  //     }
  //   } catch (error){
  //     setError("Credenciais inválidas ou erro no servidor.");
  //     console.error(error);
  //   }
    
  // }

  return (
    <main className="page_container">
      <div className="login_container">
        <div className="header_login">
          <h1 className="login_name">Login</h1>
        </div>


        <form onSubmit={handleSubmit} className="form_container">

          {/* Campo de usuário */}
          <div className="input_div">
            <label htmlFor="name">Usuário</label>
            <div className="input_logo">
              <input
                type="text"
                placeholder="Leandro"
                className="input_design"
                value={username}
                onChange={(e) => setUsername (e.target.value)}
              />
              <FaRegUser color="#FAF5E9"/>
            </div>
          </div>

          {/* Campo de senha */}
          <div className="input_div">
            <label htmlFor="password">Senha</label>
            <div className="input_logo">
              <input
                type={passwordVisible ? "text" : "password"}               
                placeholder="*****"
                className="input_design"
                value={password}
                onChange={(e) => setPassword (e.target.value)}
              />
              <button
                onClick={togglePasswordVisibility}
                className="eye"
                type="button"
                >
                {passwordVisible ? <FaEye size={18}/> : <FaEyeSlash size={18}/>}
              </button>
            </div>
          </div>

          {/* Botão para confirmar login */}
          <div className="div_button">
            <button 
              className="btn_design"
              type="submit"
              >
              Entrar
            </button>          
          </div>
        </form>    
        
      </div>
    </main>
  );
};

export default Login;

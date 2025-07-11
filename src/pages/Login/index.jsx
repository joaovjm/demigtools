import { useContext, useEffect, useState } from "react";
import "./login.css";
import { FaEye, FaEyeSlash, FaRegUser } from "react-icons/fa";
import supabase from "../../helper/superBaseClient";
import { Navigate, useNavigate } from "react-router";
import Loader from "../../components/Loader";
import OperatorSessionLogin from "../../auth/OperatorSessionLogin";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const caracterOperator = JSON.parse(localStorage.getItem("operatorData"));
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSession, setIsSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const { operatorData, setOperatorData } = useContext(UserContext);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsSession(session);
      } catch (err) {
        console.error("Login page - error checking session:", err);
      }
    };

    getSession();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setIsSession(session);
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await OperatorSessionLogin(username, password);

      if (response) {
        setIsSession(response.session);

        navigate("/dashboard");

        return null;
      }
    } catch (err) {
      console.error("Error during login:", err);
    }

    setUsername("");
    setPassword("");
    setLoading(false);
  };

  return (
    <>
      {isSession ? (
        caracterOperator ? (
          caracterOperator.operator_type === "Admin" ? (
            <Navigate to="/dashboardAdmin"/>
          ) : (
            <Navigate to="/dashboard" />
          )
        ) : (
          <Loader/>
        )
        
      ) : (
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
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                  <FaRegUser color="#FAF5E9" />
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
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    className="eye"
                    type="button"
                  >
                    {passwordVisible ? (
                      <FaEye size={18} />
                    ) : (
                      <FaEyeSlash size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Botão para confirmar login */}
              <div className="div_button">
                <button className="btn_design" type="submit">
                  {loading ? <Loader /> : "Entrar"}
                </button>
              </div>
            </form>
          </div>
        </main>
      )}
    </>
  );
};

export default Login;

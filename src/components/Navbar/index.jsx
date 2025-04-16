import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./navbar.css";
import Loader from "../Loader";
import { MdOutlineLogin } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { FaAngleDown } from "react-icons/fa";

import { AdminMenu, Navitens, OperadorMenu, RelatórioMenu } from "../Navitens";
import supabase from "../../helper/superBaseClient";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [operatorData, setOperatorData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedOperatorData = localStorage.getItem("operatorData");
    if (storedOperatorData) {
      setOperatorData(JSON.parse(storedOperatorData));
    }

    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        setIsAuthenticated(!!session);
        if (error) console.error("Session error:", error);

        if (session && !storedOperatorData) {
          console.log("Buscando os dados do operador...")
          try {
            const email = session.user.email;

            let username = email.split("@")[0];

            const { data: allOperators, error: opError } = await supabase.from(
              "operator"
            ).select(`
                operator_active,
                operator_name,
                operator_type,
                operator_uuid,
              `);

            if (opError) {
              console.error("Erro ao buscar operadores:", opError);
              return;
            }

            console.log("Operadores encontrados:", allOperators);

            // Tentar encontrar o operador que corresponde ao email informatado
            let userData = null;
            if (allOperators && allOperators.length > 0) {
              for (const op of allOperators) {
                const formattedName = op.operator_name
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f\s]/g, "")
                  .toLowerCase();

                console.log("Comparando:", formattedName, "com", username);
                if (formattedName === username) {
                  userData = op;
                  break;
                }
              }
            }

            if (userData) {
              // Salvar dados do operador no localStorage e no estado
              localStorage.setItem("operatorData", JSON.stringify(userData));
              setOperatorData(userData);
              console.log("Operador encontrado e salvo:", userData);
            } else {
              console.error("Nenhum operador encontrado para o email:", email);
            }
          } catch (fetchErr) {
            console.error("Error in operator data fetch:", fetchErr);
          }
        }
      } catch (err) {
        console.error("Error checking session:", err);
      }
    };
    getSession();

    // Set up auth listener
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);

      if (event === "SIGNED_IN" && session) {
        const storedData = localStorage.getItem("operatorData");

        if (storedData) {
          setOperatorData(JSON.parse(storedData));
        } else {
          const fetchOperatorData = async () => {
            try {
              const email = session.user.email;


              let username = email.split("@")[0];

              const { data: allOperators, error: opError } =
                await supabase.from("operator").select(`
                  operator_active,
                  operator_name,
                  operator_type,
                  operator_uuid,
                  operator_code_id
                `);

              if (opError) {
                console.error("Erro ao buscar operadores:", opError);
                return;
              }

              let userData = null;
              if (allOperators && allOperators.length > 0) {
                for (const op of allOperators) {
                  const formattedName = op.operator_name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f\s]/g, "")
                    .toLowerCase();

                  if (formattedName === username) {
                    userData = op;
                    break;
                  }
                }
              }

              if (userData) {
                localStorage.setItem("operatorData", JSON.stringify(userData));
                setOperatorData(userData);
              } else {
                console.error(
                  "Nenhum operador encontrado para o email:",
                  email
                );
              }
            } catch (fetchErr) {
              console.error("Error in operator data fetch:", fetchErr);
            }
          };

          fetchOperatorData();
        }
      }

      // Clear operator data when signing out
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("operatorData");
        setOperatorData(null);
      }
    });

    // Cleanup on unmount
    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  const onClickUserIcon = () => {
    setIsOpen(!isOpen);
  };

  const onClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileDropdownClick = (title) => {
    setActiveMobileDropdown(activeMobileDropdown === title ? null : title);
  };

  const onClickOutsideMobileMenu = (event) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target)
    ) {
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", onClickOutside);
    } else {
      document.removeEventListener("mousedown", onClickOutside);
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", onClickOutsideMobileMenu);
    } else {
      document.removeEventListener("mousedown", onClickOutsideMobileMenu);
    }

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("mousedown", onClickOutsideMobileMenu);
    };
  }, [isOpen, mobileMenuOpen]);

  // Verificar periodicamente se o operador está autenticado mas sem dados
  useEffect(() => {
    if (isAuthenticated && !operatorData) {
      // Se estiver autenticado mas sem dados, tentar buscar novamente após um tempo
      const timer = setTimeout(async () => {
        console.log("Verificando operatorData novamente...");

        // Verificar se já há dados no localStorage (podem ter sido carregados por outra parte do código)
        const storedData = localStorage.getItem("operatorData");
        if (storedData) {
          setOperatorData(JSON.parse(storedData));
          return;
        }

        // Se não houver dados no localStorage, buscar da API
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session && session.user) {
            const email = session.user.email;
            let username = email.split("@")[0];

            // Buscar todos os operadores
            const { data: allOperators } = await supabase.from("operator")
              .select(`
                operator_active,
                operator_name,
                operator_type,
                operator_uuid
              `);

            // Encontrar o operador correspondente ao email atual
            if (allOperators && allOperators.length > 0) {
              for (const op of allOperators) {
                const formattedName = op.operator_name
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f\s]/g, "")
                  .toLowerCase();

                if (formattedName === username) {
                  localStorage.setItem("operatorData", JSON.stringify(op));
                  setOperatorData(op);
                  console.log(
                    "Operador encontrado e salvo na verificação periódica:",
                    op
                  );
                  break;
                }
              }
            }
          }
        } catch (error) {
          console.error("Erro ao tentar buscar dados do operador:", error);
        }
      }, 2000); // Verificar após 2 segundos

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, operatorData]);

  const signOut = async () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem("operatorData");
      setOperatorData(null);
      navigate("/");
      setIsAuthenticated(false);
      setShowDropdown(null);
      setMobileMenuOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <header className="header-nav">
        <nav className="nav">
          <div className="nav-logo">
            {isAuthenticated ? (
              <Link to="/dashboard" className="logo">
                <span className="span-logo-1">DEMI</span><span className="span-logo-2">GT</span><span className="span-logo-3">ools</span>
              </Link>
            ) : (
              <Link to="/" className="logo">
                <span className="span-logo-1">DEMI</span><span className="span-logo-2">GT</span><span className="span-logo-3">ools</span>
              </Link>
            )}
          </div>

          {isAuthenticated && operatorData?.operator_type === "Admin" ? (
            <div className="menu-and-logo">
              {/* Desktop menu */}
              <ul className="nav-items">
                {Navitens.map((item) => (
                  <li
                    key={item.id}
                    className={item.cName}
                    onMouseEnter={() => setShowDropdown(item.title)}
                    onMouseLeave={() => setShowDropdown(null)}
                  >
                    <div className="nav-item-content">
                      <p>{item.title}</p>
                      <FaAngleDown className="dropdown-icon" />
                    </div>

                    {/* Dropdown Sob-menu AdminMenu */}
                    {item.title === "Admin" && showDropdown === "Admin" && (
                      <ul
                        className="dropdown-admin"
                        onClick={() => setShowDropdown(null)}
                      >
                        {AdminMenu.map((admin) => (
                          <li key={admin.id} className={admin.cName}>
                            <Link to={admin.path}>{admin.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Dropdown Sob-menu RelatórioMenu */}
                    {item.title === "Relatório" &&
                      showDropdown === "Relatório" && (
                        <ul
                          className="dropdown-admin"
                          onClick={() => setShowDropdown(null)}
                        >
                          {RelatórioMenu.map((admin) => (
                            <li key={admin.id} className={admin.cName}>
                              <Link to={admin.path}>{admin.title}</Link>
                            </li>
                          ))}
                        </ul>
                      )}

                    {/* Dropdown Sob-menu OperadorMenu */}
                    {item.title === "Operador" &&
                      showDropdown === "Operador" && (
                        <ul
                          className="dropdown-admin"
                          onClick={() => setShowDropdown(null)}
                        >
                          {OperadorMenu.map((admin) => (
                            <li key={admin.id} className={admin.cName}>
                              <Link to={admin.path}>{admin.title}</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                ))}
              </ul>
              <div
                ref={dropdownRef}
                className="user-profile desktop-only"
                onMouseEnter={() => setShowDropdown("userIcon")}
                onMouseLeave={() => setShowDropdown(null)}
              >
                <IoPersonCircleOutline
                  onClick={onClickUserIcon}
                  className="icon-user"
                />

                {/*ATENÇÃO, ESSE SERÀ O PROXIMO*/}

                {isOpen && showDropdown === "userIcon" && (
                  <ul className="dropdown-admin user-dropdown">
                    {operatorData && (
                      <li className="nav-item operator-info">
                        <p>{operatorData?.operator_name}</p>
                        <p className="operator-type">
                          {operatorData?.operator_type}
                        </p>
                      </li>
                    )}
                    <li className="nav-item" onClick={signOut}>
                      {loading ? <Loader /> : "Sair"}
                    </li>
                  </ul>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="mobile-menu-toggle">
                <button onClick={handleMobileMenuClick}>
                  {mobileMenuOpen ? <HiX /> : <HiMenu />}
                </button>
              </div>
            </div>
          ) : isAuthenticated && operatorData?.operator_type === "Operador" ? (
            <div className="menu-and-logo">
              <div className="nav-item-content">
                <ul className="nav-items">
                  <li
                    key={Navitens[2].id}
                    className={Navitens[2].cName}
                    onMouseEnter={() => setShowDropdown(Navitens[2].title)}
                    onMouseLeave={() => setShowDropdown(null)}
                  >
                    <p>{Navitens[2].title}</p>
                    <FaAngleDown className="dropdown-icon" />

                    {Navitens[2].title === "Operador" &&
                      showDropdown === "Operador" && (
                        <ul
                          className="dropdown-admin"
                          onClick={() => setShowDropdown(null)}
                        >
                          {OperadorMenu.map((admin) => (
                            <li key={admin.id} className={admin.cName}>
                              <Link to={admin.path}>{admin.title}</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                </ul>
              </div>
              <div
                ref={dropdownRef}
                className="user-profile desktop-only"
                onMouseEnter={() => setShowDropdown("userIcon")}
                onMouseLeave={() => setShowDropdown(null)}
              >
                <IoPersonCircleOutline
                  onClick={onClickUserIcon}
                  className="icon-user"
                />

                {/*ATENÇÃO, ESSE SERÀ O PROXIMO*/}

                {isOpen && showDropdown === "userIcon" && (
                  <ul className="dropdown-admin user-dropdown">
                    {operatorData && (
                      <li className="nav-item operator-info">
                        <p>{operatorData?.operator_name}</p>
                        <p className="operator-type">
                          {operatorData?.operator_type}
                        </p>
                      </li>
                    )}
                    <li className="nav-item" onClick={signOut}>
                      {loading ? <Loader /> : "Sair"}
                    </li>
                  </ul>
                )}
              </div>
              <div className="mobile-menu-toggle">
                <button onClick={handleMobileMenuClick}>
                  {mobileMenuOpen ? <HiX /> : <HiMenu />}
                </button>
              </div>
            </div>
          ) : isAuthenticated ? (
            // Show loading indicator while operatorData is being loaded
            <div className="menu-and-logo">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Loader />
                  <span>Carregando menu...</span>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: "10px",
                    padding: "5px 10px",
                    background: "#f0f0f0",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Recarregar página
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="link_login">
              <MdOutlineLogin />
              Login
            </Link>
          )}
        </nav>

        {/* Mobile menu */}
        {isAuthenticated && operatorData?.operator_type === "Admin" ? (
          <div
            ref={mobileMenuRef}
            className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}
          >
            <ul className="mobile-nav-items">
              {Navitens.map((item) => (
                <li key={item.id} className="mobile-nav-item">
                  <div
                    className="mobile-nav-header"
                    onClick={() => handleMobileDropdownClick(item.title)}
                  >
                    <p>{item.title}</p>
                    <FaAngleDown
                      className={`dropdown-icon ${
                        activeMobileDropdown === item.title ? "rotated" : ""
                      }`}
                    />
                  </div>

                  {/* Mobile Dropdown menus */}
                  {item.title === "Admin" &&
                    activeMobileDropdown === "Admin" && (
                      <ul className="mobile-dropdown">
                        {AdminMenu.map((admin) => (
                          <li key={admin.id} className="mobile-dropdown-item">
                            <Link
                              to={admin.path}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {admin.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                  {item.title === "Relatório" &&
                    activeMobileDropdown === "Relatório" && (
                      <ul className="mobile-dropdown">
                        {RelatórioMenu.map((admin) => (
                          <li key={admin.id} className="mobile-dropdown-item">
                            <Link
                              to={admin.path}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {admin.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                  {item.title === "Operador" &&
                    activeMobileDropdown === "Operador" && (
                      <ul className="mobile-dropdown">
                        {OperadorMenu.map((admin) => (
                          <li key={admin.id} className="mobile-dropdown-item">
                            <Link
                              to={admin.path}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {admin.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
              <li className="mobile-nav-item sign-out" onClick={signOut}>
                {operatorData && (
                  <div className="mobile-operator-info">
                    <p>{operatorData?.operator_name}</p>
                    <p className="operator-type">
                      {operatorData?.operator_type}
                    </p>
                  </div>
                )}
                {loading ? <Loader /> : "Sair"}
              </li>
            </ul>
          </div>
        ) : (
          isAuthenticated &&
          operatorData?.operator_type === "Operador" && (
            <div
              ref={mobileMenuRef}
              className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}
            >
              <ul className="mobile-nav-items">
                <li key={Navitens[2].id} className="mobile-nav-item">
                  <div
                    className="mobile-nav-header"
                    onClick={() => handleMobileDropdownClick(Navitens[2].title)}
                  >
                    <p>{Navitens[2].title}</p>
                    <FaAngleDown
                      className={`dropdown-icon ${
                        activeMobileDropdown === Navitens[2].title ? "rotated" : ""
                      }`}
                    />
                  </div>

                  {/* Mobile Dropdown menus */}

                  {Navitens[2].title === "Operador" &&
                    activeMobileDropdown === "Operador" && (
                      <ul className="mobile-dropdown">
                        {OperadorMenu.map((admin) => (
                          <li key={admin.id} className="mobile-dropdown-item">
                            <Link
                              to={admin.path}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {admin.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>

                <li className="mobile-nav-item sign-out" onClick={signOut}>
                  {operatorData && (
                    <div className="mobile-operator-info">
                      <p>{operatorData?.operator_name}</p>
                      <p className="operator-type">
                        {operatorData?.operator_type}
                      </p>
                    </div>
                  )}
                  {loading ? <Loader /> : "Sair"}
                </li>
              </ul>
            </div>
          )
        )}
      </header>
      <Outlet />
    </>
  );
};

export default Navbar;

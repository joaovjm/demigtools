import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [operatorData, setOperatorData] = useState();

  const fetchOperatorData = async (email) => {
    const username = email.split("@")[0];

    const { data: allOperators, error } = await supabase.from("operator")
      .select(`
      operator_active,
      operator_name,
      operator_type,
      operator_uuid,
      operator_code_id
    `);

    if (error) {
      console.error("Erro ao buscar operadores:", error);
      return;
    }

    const userData = allOperators?.find((op) => {
      const formattedName = op.operator_name
        .normalize("NFD")
        .replace(/[\u0300-\u036f\s]/g, "")
        .toLowerCase();
      return formattedName === username;
    });
    if (userData) {
      localStorage.setItem("operatorData", JSON.stringify(userData));
      setOperatorData(userData);
      console.log("Operador encontrado e salvo:", userData);
    } else {
      console.error("Nenhum operador encontrado para o email:", email);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const stored = localStorage.getItem("operatorData");
      if (stored) {
        setOperatorData(JSON.parse(stored));
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) console.error("Erro na sessão:", error);
      setIsAuthenticated(!!session);

      if (session && !stored) {
        await fetchOperatorData(session.user.email);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuthenticated(!!session);

        if (event === "SIGNED_IN" && session) {
          const stored = localStorage.getItem("operatorData");
          if (stored) {
            setOperatorData(JSON.parse(stored));
          } else {
            await fetchOperatorData(session.user.email);
          }
        }

        if (event === "SIGNED_OUT") {
          localStorage.removeItem("operatorData");
          setOperatorData(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [setOperatorData]);

  useEffect(() => {
    if (isAuthenticated && !operatorData) {
      const timer = setTimeout(async () => {
        const stored = localStorage.getItem("operatorData");
        if (stored) {
          setOperatorData(JSON.parse(stored));
        } else {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.user) {
            await fetchOperatorData(session.user.email);
          }
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, operatorData, setOperatorData]);

  const onClickUserIcon = () => setIsOpen(!isOpen);
  const onClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  const handleMobileMenuClick = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleMobileDropdownClick = (title) => {
    setActiveMobileDropdown(activeMobileDropdown === title ? null : title);
  };
  const onClickOutsideMobileMenu = (e) => {
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", onClickOutside);
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", onClickOutsideMobileMenu);
    }

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("mousedown", onClickOutsideMobileMenu);
    };
  }, [isOpen, mobileMenuOpen]);

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

  const handleLogoClick = (e) => {
    if (location.pathname === e) {
      navigate(location.pathname);
    } else {
      navigate(e);
    }
  };

  return (
    <>
      <header className="header-nav">
        <nav className="nav">
          <div className="nav-logo">
            {isAuthenticated ? (
              operatorData ? (
                <div
                  onClick={() =>
                    handleLogoClick(
                      operatorData.operator_type === "Admin"
                        ? "/dashboardAdmin"
                        : "/dashboard"
                    )
                  }
                  className="logo"
                >
                  <span className="span-logo-1">DEMI</span>
                  <span className="span-logo-2">GT</span>
                  <span className="span-logo-3">ools</span>
                </div>
              ) : (
                <Loader />
              )
            ) : (
              <Link to="/" className="logo">
                <span className="span-logo-1">DEMI</span>
                <span className="span-logo-2">GT</span>
                <span className="span-logo-3">ools</span>
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
                          <li
                            key={admin.id}
                            className={admin.cName}
                            onClick={() => navigate(admin.path)}
                          >
                            {admin.title}
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
                            <li
                              key={admin.id}
                              className={admin.cName}
                              onClick={() => navigate(admin.path)}
                            >
                              {admin.title}
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
                            <li
                              key={admin.id}
                              className={admin.cName}
                              onClick={() => navigate(admin.path)}
                            >
                              {admin.title}
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
          ) : isAuthenticated && (operatorData?.operator_type === "Operador" || operatorData?.operator_type === "Operador Casa") ? (
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
          (operatorData?.operator_type === "Operador" || operatorData?.operator_type === "Operador Casa") && (
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
                        activeMobileDropdown === Navitens[2].title
                          ? "rotated"
                          : ""
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
      {/* <Outlet /> */}
    </>
  );
};

export default Navbar;

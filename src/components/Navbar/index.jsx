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
  
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(!!session);
    };

    getSession();
  }, [<Outlet />]);

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
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
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

  const signOut = async () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
                <span>DEMIG</span>Tools
              </Link>
            ) : (
              <Link to="/" className="logo">
                <span>DEMIG</span>Tools
              </Link>
            )}
          </div>

          {!isAuthenticated ? (
            <Link to="/login" className="link_login">
              <MdOutlineLogin />
              Login
            </Link>
          ) : (
            <>
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
                      <ul className="dropdown-admin" onClick={() => setShowDropdown(null)}>
                        {AdminMenu.map((admin) => (
                          <li key={admin.id} className={admin.cName}>
                            <Link to={admin.path}>{admin.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Dropdown Sob-menu RelatórioMenu */}
                    {item.title === "Relatório" && showDropdown === "Relatório" && (
                      <ul className="dropdown-admin" onClick={() => setShowDropdown(null)}>
                        {RelatórioMenu.map((admin) => (
                          <li key={admin.id} className={admin.cName}>
                            <Link to={admin.path}>{admin.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Dropdown Sob-menu OperadorMenu */}
                    {item.title === "Operador" && showDropdown === "Operador" && (
                      <ul className="dropdown-admin" onClick={() => setShowDropdown(null)}>
                        {OperadorMenu.map((admin) => (
                          <li key={admin.id} className={admin.cName}>
                            <Link to={admin.path}>{admin.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
                <div 
                  ref={dropdownRef} 
                  className="user-profile"
                  onMouseEnter={() => setShowDropdown("userIcon")}
                  onMouseLeave={() => setShowDropdown(null)}
                >
                  <IoPersonCircleOutline
                    onClick={onClickUserIcon}
                    className="icon-user"
                  />

                  {isOpen && showDropdown === "userIcon" && (
                    <ul className="dropdown-admin user-dropdown">
                      <li className="nav-item" onClick={signOut}>
                        {loading ? <Loader/> : "Sair"}
                      </li>
                    </ul>
                  )}
                </div>
              </ul>

              {/* Mobile menu button */}
              <div className="mobile-menu-toggle">
                <button onClick={handleMobileMenuClick}>
                  {mobileMenuOpen ? <HiX /> : <HiMenu />}
                </button>
              </div>
            </>
          )}
        </nav>

        {/* Mobile menu */}
        {isAuthenticated && (
          <div 
            ref={mobileMenuRef}
            className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}
          >
            <ul className="mobile-nav-items">
              {Navitens.map((item) => (
                <li key={item.id} className="mobile-nav-item">
                  <div 
                    className="mobile-nav-header"
                    onClick={() => handleMobileDropdownClick(item.title)}
                  >
                    <p>{item.title}</p>
                    <FaAngleDown className={`dropdown-icon ${activeMobileDropdown === item.title ? 'rotated' : ''}`} />
                  </div>

                  {/* Mobile Dropdown menus */}
                  {item.title === "Admin" && activeMobileDropdown === "Admin" && (
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

                  {item.title === "Relatório" && activeMobileDropdown === "Relatório" && (
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

                  {item.title === "Operador" && activeMobileDropdown === "Operador" && (
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
                {loading ? <Loader/> : "Sair"}
              </li>
            </ul>
          </div>
        )}
      </header>
      <Outlet />
    </>
  );
};

export default Navbar;

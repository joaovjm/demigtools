import React, { createRef, useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import "./navbar.css";
import Loader from "../Loader";
import { MdOutlineLogin } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";

import { AdminMenu, Navitens, OperadorMenu, RelatórioMenu } from "../Navitens";
import supabase from "../../../helper/superBaseClient";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdowmRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  

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
    if (dropdowmRef.current && !dropdowmRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", onClickOutside);
    } else {
      document.removeEventListener("mousedown", onClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isOpen]);

  const sugnOut = async () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      setIsAuthenticated(false);
      setShowDropdown(null);
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <nav className="nav">
          {isAuthenticated ? (
            <Link to="/dashboard">logo</Link>
          ) : (
            <Link to="/">logo</Link>
          )}

          {!isAuthenticated ? (
            <Link to="/login" className="link_login">
              <MdOutlineLogin />
              Login
            </Link>
          ) : (
            <ul className="nav-items">
              {Navitens.map((item) => (
                <li
                  key={item.id}
                  className={item.cName}
                  onMouseEnter={() => setShowDropdown(item.title)}
                  onMouseLeave={() => setShowDropdown(null)}
                >
                  <p>{item.title}</p>

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

                  {item.title === "Relatório" &&
                    showDropdown == "Relatório" && (
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
              <div ref={dropdowmRef} onMouseEnter={() => setShowDropdown("userIcon")}>
                <IoPersonCircleOutline
                  name="userIcon"
                  onClick={onClickUserIcon}
                  className="icon-user"
                />

                {isOpen && showDropdown === "userIcon" && (
                  <ul
                    className="dropdown-admin"
                    style={{ width: "80px", minHeight: "10px" }}
                    
                  >
                    <li className="nav-item" onClick={sugnOut}>
                      {loading ? <Loader/> : "Sair"}
                    </li>
                  </ul>
                )}
              </div>
            </ul>
          )}
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default Navbar;

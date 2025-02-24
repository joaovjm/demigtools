import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";
import "./navbar.css";
import { MdOutlineLogin } from "react-icons/md";
import { AdminMenu, Navitens, OperadorMenu, RelatórioMenu } from "../Navitens";
import supabase from "../../../helper/superBaseClient";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      setIsAuthenticated(!!session);
    };

    getSession();
  }, [isAuthenticated]);

  return (
    <>
      <header>
        <nav className="nav">
          <Link to="/">
            logo
          </Link>

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
                    <ul className="dropdown-admin">
                      {AdminMenu.map((admin) => (
                        <li key={admin.id} className={admin.cName}>
                          <Link to={admin.path}>{admin.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Dropdown Sob-menu RelatórioMenu */}

                  {item.title === "Relatório" && showDropdown == "Relatório" && (
                    <ul className="dropdown-admin">
                      {RelatórioMenu.map((admin) => (
                        <li key={admin.id} className={admin.cName}>
                          <Link to={admin.path}>{admin.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Dropdown Sob-menu OperadorMenu */}

                  {item.title === "Operador" && showDropdown === "Operador" && (
                    <ul className="dropdown-admin">
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
          )}
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default Navbar;

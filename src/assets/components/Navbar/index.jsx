import React, { useState } from "react";
import { Link, Outlet } from "react-router";
import "./navbar.css";
import { MdOutlineLogin } from "react-icons/md";
import { AdminMenu, Navitens, OperadorMenu, RelatórioMenu } from "../Navitens";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showDropdown, setShowDropdown] = useState(null);

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

import React from "react";
import { Link, Outlet } from "react-router";
import "./navbar.css";
import { MdOutlineLogin } from "react-icons/md";

const Navbar = () => {
  return (
    <>
      <header >
        <nav className="nav">
          <Link to="/" className="logo">
            Logo
          </Link>
          <Link to="/login" className="link_login">
            <MdOutlineLogin />
            Login
          </Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default Navbar;

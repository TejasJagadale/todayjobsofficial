import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBriefcase,
  FiUsers,
  FiBell,
  FiMenu,
  FiX,
} from "react-icons/fi";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};


  return (
    <nav className="navbar">
      {/* Left */}
      <div className="navbar-left" onClick={() => navigate("/")}>
        <h2 className="logo">Today Jobs</h2>
      </div>

      {/* Center */}
      <ul className={`navbar-center ${menuOpen ? "open" : ""}`}>
        <li>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            <FiHome /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/jobs" onClick={() => setMenuOpen(false)}>
            <FiBriefcase /> Jobs
          </NavLink>
        </li>
        <li>
          <NavLink to="/companies" onClick={() => setMenuOpen(false)}>
            <FiUsers /> Companies
          </NavLink>
        </li>
      </ul>

      {/* Right */}
      <div className="navbar-right">
        <button className="notification">
          <FiBell />
        </button>

        <div className="profile" onClick={() => navigate("/profile")}>
          <img
            src={user?.profile_image || "/assets/login/lap.png"}
            alt="profile"
          />
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

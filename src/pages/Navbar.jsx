import React from "react";
import "../styles/Navbar.css";
import logo from "./assets/react.svg";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <img src={logo} alt="HarvestGuard Logo" />
        </div>
        <span className="navbar-title">HarvestGuard</span>
      </div>
      <div className="navbar-right">
        <button className="navbar-lang">
          <span role="img" aria-label="language">🌐</span> বাংলা
        </button>
        <a href="#about" className="navbar-link">About Us</a>
        <button className="navbar-cta">Join the Movement</button>
      </div>
    </nav>
  );
};

export default Navbar;

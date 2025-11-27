
import React from "react";
import "./Navbar.css";
import logo from "../assets/react.svg";
import { Link, useNavigate } from 'react-router-dom';

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
          <span role="img" aria-label="language" style={{color:'#1ecfff', fontSize:'1.2em'}}>🌐</span> <span style={{color:'#fffbe6', fontWeight:600}}>বাংলা</span>
        </button>
        <a href="#about" className="navbar-link">About Us</a>
        <Link to="/login" className="navbar-cta" style={{textDecoration:'none'}}>
          Join the Movement
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

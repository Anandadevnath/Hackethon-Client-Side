
import React, { useRef, useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../assets/react.svg";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

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

        {user ? (
          <div className="navbar-profile" ref={wrapperRef}>
            <div className="profile-trigger" onClick={() => setMenuOpen(v => !v)} role="button" tabIndex={0}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name || 'Profile'} className="profile-avatar" />
              ) : (
                <div className="profile-avatar fallback">{(user.name && user.name[0]) || 'U'}</div>
              )}
              <span className="profile-name">{user.name || user.email || 'User'}</span>
            </div>
            <div className={"profile-menu" + (menuOpen ? ' open' : '')}>
              <Link to="/profile" className="profile-menu-item" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button className="profile-menu-item" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="navbar-cta" style={{textDecoration:'none'}}>
            Join the Movement
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

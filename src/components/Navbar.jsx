
import React, { useRef, useState, useEffect } from "react";
import "./Navbar.css";
import logoEn from "../assets/Gemini_Generated_Image_ppkkebppkkebppkk-removebg-preview.png";
import logoBn from "../assets/Gemini_Generated_Image_ld4a7tld4a7tld4a-removebg-preview.png";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => {
      // when user scrolls down a bit, toggle scrolled state so navbar becomes fixed
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={"navbar" + (scrolled ? ' scrolled' : '')}>
      <div className="navbar-inner">
        <div className="navbar-left">
          <div className="navbar-wordmark">
            <img src={lang === 'en' ? logoEn : logoBn} alt="HarvestGuard" />
          </div>
        </div>
        <div className="navbar-right">
        <button className="navbar-lang" onClick={() => setLang(l => l === 'en' ? 'bn' : 'en')}>
          <span role="img" aria-label="language" style={{color:'#1ecfff', fontSize:'1.1em'}}>🌐</span>
          <span style={{color:'#fffbe6', fontWeight:600, marginLeft:8}}>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
        </button>
        <a href="#about" className="navbar-link">{lang === 'en' ? 'About Us' : 'আমাদের সম্পর্কে'}</a>

        {user ? (
          <Link to="/dashboard" className="navbar-dashboard">{lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}</Link>
        ) : null}

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
              <Link to="/dashboard" className="profile-menu-item" onClick={() => setMenuOpen(false)}>{lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}</Link>
              <Link to="/profile" className="profile-menu-item" onClick={() => setMenuOpen(false)}>{lang === 'en' ? 'Profile' : 'প্রোফাইল'}</Link>
              <button className="profile-menu-item" onClick={handleLogout}>{lang === 'en' ? 'Logout' : 'লগআউট'}</button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="navbar-cta" style={{textDecoration:'none'}}>
            {lang === 'en' ? 'Join the Movement' : 'যোগ দিন'}
          </Link>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

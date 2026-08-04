import React, { useRef, useState } from "react";
import logoEn from "../assets/harvest-en-removebg-preview.png";
import logoBn from "../assets/harvest-bn-removebg-preview.png";
import { useLanguage } from "../context/LanguageContext";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe, Menu, X } from 'lucide-react';
import { useScroll, useOutsideClick } from "../hooks/useNavbarHooks";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const wrapperRef = useRef(null);
  const scrolled = useScroll();
  useOutsideClick(wrapperRef, () => setMenuOpen(false));

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navClasses = scrolled
    ? 'fixed top-0 left-0 right-0 bg-transparent backdrop-blur-md shadow-sm'
    : 'absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent';

  const textColor = scrolled ? 'text-green-800' : 'text-white';

  return (
    <nav className={`z-[9999] box-border transition-all duration-300 ${navClasses}`}>
      <div className="max-w-[1400px] mx-auto px-4 py-0 flex items-center justify-between min-h-[72px]">
        <Link to="/" className="inline-block">
          <img src={lang === 'en' ? logoEn : logoBn} alt="HarvestGuard" className="h-12 md:h-16 max-w-[140px] md:max-w-[180px] object-contain block" />
        </Link>

        <div className="hidden md:flex items-center gap-8 justify-end">
          <button onClick={() => setLang(l => l === 'en' ? 'bn' : 'en')} className={`flex items-center gap-2 text-sm font-semibold ${textColor}`}>
            <Globe className="w-5 h-5" />
            <span>{lang === 'en' ? 'বাংলা' : 'ইংরেজি'}</span>
          </button>

          <Link to="/about" className={`text-base font-semibold ${textColor} hover:opacity-80`}>{lang === 'en' ? 'About Us' : 'আমাদের সম্পর্কে'}</Link>

          {user ? (
            <Link to="/dashboard" className="bg-green-800 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-900 transition-colors">{lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}</Link>
          ) : (
            <Link to="/login" className="bg-gradient-to-r from-[#9ef96a] to-[#49c74f] text-[#05310d] rounded-[28px] px-6 py-2 font-bold no-underline shadow-[0_10px_30px_rgba(46,125,50,0.18),0_0_0_6px_rgba(73,199,79,0.06)] transition-transform duration-150 hover:-translate-y-1">{lang === 'en' ? 'Join the Movement' : 'যোগ দিন'}</Link>
          )}

          {user && (
            <div className="relative" ref={wrapperRef}>
              <button className={`flex items-center gap-2 ${textColor}`} onClick={() => setMenuOpen(!menuOpen)}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/10 font-bold">{(user.name && user.name[0]) || 'U'}</div>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white text-green-900 rounded-xl shadow-xl min-w-[150px] py-2 flex flex-col">
                  <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>{lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}</Link>
                  <Link to="/profile" className="px-4 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>{lang === 'en' ? 'Profile' : 'প্রোফাইল'}</Link>
                  <button className="px-4 py-2 text-left hover:bg-gray-100 text-red-600" onClick={handleLogout}>{lang === 'en' ? 'Logout' : 'লগআউট'}</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className={`md:hidden p-2 ${textColor}`} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

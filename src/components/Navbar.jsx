import React, { useRef, useEffect, useState } from "react";
import logoEn from "../assets/harvest-en-removebg-preview.png";
import logoBn from "../assets/harvest-bn-removebg-preview.png";
import { useLanguage } from "../context/LanguageContext";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${scrolled ? 'fixed top-0 left-0 right-0' : 'absolute top-4 left-0 right-0'} z-[9999] box-border transition-all duration-200 ${scrolled ? 'bg-[linear-gradient(90deg,rgba(159, 240, 177, 0.61)_0%,rgba(154, 255, 126, 0.34)_100%)] shadow-[0_6px_20px_rgba(6,40,20,0.12)] backdrop-blur-[11px] backdrop-saturate-120' : 'bg-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-4 py-0 flex items-center justify-between min-h-[72px]">
          <div className="flex items-center">
            <div className="flex items-center">
              <Link to="/" className="inline-block">
                <img src={lang === 'en' ? logoEn : logoBn} alt="HarvestGuard" className="h-14 md:h-[90px] block" />
              </Link>
            </div>
          </div>
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => setLang(l => l === 'en' ? 'bn' : 'en')} className="flex items-center gap-2 text-sm">
            <span role="img" aria-label="language" className="text-[#1ecfff] text-[1.1em]">🌐</span>
            <span className="text-[#67e794] font-semibold">{lang === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          <Link to="/about" className="text-[#73ffa4] text-base font-semibold no-underline px-2 py-1 rounded hover:bg-white/5">{lang === 'en' ? 'About Us' : 'আমাদের সম্পর্কে'}</Link>

          {user ? (
            <Link to="/dashboard" className="bg-white/90 text-[#0b6b3a] px-3 py-2 rounded-[10px] font-bold no-underline shadow-[0_6px_14px_rgba(6,40,20,0.06)]">{lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}</Link>
          ) : null}

          {user ? (
            <div className="relative flex items-center" ref={wrapperRef}>
              <div className="flex items-center gap-2 cursor-pointer text-[#fffbe6]" onClick={() => setMenuOpen(v => !v)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setMenuOpen(v => !v)}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name || 'Profile'} className="w-11 h-11 rounded-full object-cover border-2 border-white/12" />
                ) : (
                  <div className="w-11 h-11 rounded-full inline-flex items-center justify-center bg-black/15 text-[#fffbe6] font-bold">{(user.name && user.name[0]) || 'U'}</div>
                )}
                <span className="text-[#fffbe6] font-semibold">{user.name || user.email || 'User'}</span>
              </div>

              <div className={`absolute right-0 top-full mt-2 bg-gradient-to-b from-white to-[#fbfff8] text-[#0a4d2c] rounded-[10px] shadow-[0_10px_28px_rgba(6,40,20,0.12)] min-w-[180px] flex flex-col overflow-hidden z-[10001] transition-all duration-150 ${menuOpen ? 'opacity-100 translate-y-0 visible pointer-events-auto' : 'opacity-0 translate-y-1 invisible pointer-events-none'}`}>
                <Link to="/dashboard" className="px-4 py-3 text-left no-underline" onClick={() => setMenuOpen(false)}>{lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}</Link>
                <Link to="/profile" className="px-4 py-3 text-left no-underline" onClick={() => setMenuOpen(false)}>{lang === 'en' ? 'Profile' : 'প্রোফাইল'}</Link>
                <button className="px-4 py-3 text-left" onClick={handleLogout}>{lang === 'en' ? 'Logout' : 'লগআউট'}</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-gradient-to-r from-[#9ef96a] to-[#49c74f] text-[#05310d] rounded-[28px] px-4 py-2 font-bold no-underline shadow-[0_10px_30px_rgba(46,125,50,0.18),0_0_0_6px_rgba(73,199,79,0.06)] transition-transform duration-150 hover:-translate-y-1">{lang === 'en' ? 'Join the Movement' : 'যোগ দিন'}</Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center md:hidden">
          <button onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu" className="p-2 rounded-md bg-white/6 backdrop-blur-sm">
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden px-4 pb-4 transition-max-h duration-300 overflow-hidden ${mobileOpen ? 'max-h-[400px] ease-out' : 'max-h-0'}`}>
        <div className="flex flex-col gap-3 pt-3">
          <button onClick={() => { setLang(l => l === 'en' ? 'bn' : 'en'); setMobileOpen(false); }} className="flex items-center gap-2 text-sm text-[#fffbe6]">
            <span role="img" aria-label="language" className="text-[#1ecfff] text-[1.1em]">🌐</span>
            <span className="font-semibold">{lang === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          <Link to="/about" onClick={() => setMobileOpen(false)} className="text-[#fffbe6] text-base font-semibold no-underline px-2 py-1 rounded hover:bg-white/5">{lang === 'en' ? 'About Us' : 'আমাদের সম্পর্কে'}</Link>

          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block bg-white/90 text-[#0b6b3a] px-3 py-2 rounded-[10px] font-bold no-underline shadow-[0_6px_14px_rgba(6,40,20,0.06)]">{lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block text-[#fffbe6] px-2 py-2">{lang === 'en' ? 'Profile' : 'প্রোফাইল'}</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-left px-2 py-2 text-[#fffbe6]">{lang === 'en' ? 'Logout' : 'লগআউট'}</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block bg-gradient-to-r from-[#9ef96a] to-[#49c74f] text-[#05310d] rounded-[28px] px-4 py-2 font-bold no-underline shadow-[0_10px_30px_rgba(46,125,50,0.18),0_0_0_6px_rgba(73,199,79,0.06)] transition-transform duration-150 hover:-translate-y-1">{lang === 'en' ? 'Join the Movement' : 'যোগ দিন'}</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

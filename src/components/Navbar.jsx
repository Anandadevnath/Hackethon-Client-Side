import React, { useRef, useEffect, useState } from "react";
import logoEn from "../assets/harvest-en-removebg-preview.png";
import logoBn from "../assets/harvest-bn-removebg-preview.png";
import { useLanguage } from "../context/LanguageContext";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe, Info, LayoutGrid, User, LogOut, Menu, X, Sparkles } from 'lucide-react';

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
                <img src={lang === 'en' ? logoEn : logoBn} alt="HarvestGuard" className="h-12 md:h-16 max-w-[140px] md:max-w-[180px] object-contain block" />
              </Link>
            </div>
          </div>
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => setLang(l => l === 'en' ? 'bn' : 'en')} className="flex items-center gap-2 text-sm">
            <Globe className={`w-5 h-5 transition-colors duration-200 ${scrolled ? 'text-[#0b6b3a]' : 'text-[#67e794]'}`} />
            <span className={`font-semibold transition-colors duration-200 ${scrolled ? 'text-[#0b6b3a]' : 'text-[#67e794]'}`}>{lang === 'en' ? 'বাংলা' : 'ইংরেজি'}</span>
          </button>

          <Link to="/about" className={`text-base font-semibold no-underline px-2 py-1 rounded transition-colors duration-200 ${scrolled ? 'text-[#0b6b3a] hover:bg-black/5' : 'text-[#73ffa4] hover:bg-white/5'}`}>{lang === 'en' ? 'About Us' : 'আমাদের সম্পর্কে'}</Link>

          {user ? (
            <Link to="/dashboard" className="bg-[#0b6b3a] text-white px-3 py-2 rounded-[10px] font-bold no-underline shadow-[0_6px_14px_rgba(6,40,20,0.15)]">{lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}</Link>
          ) : null}

          {user ? (
            <div className="relative flex items-center" ref={wrapperRef}>
              <div className={`flex items-center gap-2 cursor-pointer transition-colors duration-200 ${scrolled ? 'text-[#0b6b3a]' : 'text-[#fffbe6]'}`} onClick={() => setMenuOpen(v => !v)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setMenuOpen(v => !v)}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name || 'Profile'} className={`w-10 h-10 rounded-full object-cover border-2 ${scrolled ? 'border-[#0b6b3a]/20' : 'border-white/20'}`} />
                ) : (
                  <div className={`w-10 h-10 rounded-full inline-flex items-center justify-center font-bold ${scrolled ? 'bg-[#0b6b3a]/10 text-[#0b6b3a]' : 'bg-black/15 text-[#fffbe6]'}`}>{(user.name && user.name[0]) || 'U'}</div>
                )}
                <span className="font-semibold">{user.name || user.email || 'User'}</span>
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
          <button onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu" className={`p-2 rounded-md backdrop-blur-sm ${scrolled ? 'bg-[#0b6b3a]/10' : 'bg-white/10'}`}>
            {mobileOpen ? (
              <X className={`h-6 w-6 ${scrolled ? 'text-[#0b6b3a]' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${scrolled ? 'text-[#0b6b3a]' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel - Glassmorphism */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-[450px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mx-3 mb-4 p-5 rounded-3xl bg-gradient-to-br from-white/70 via-white/60 to-green-50/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40">
          <div className="flex flex-col gap-2">
            {/* Language Toggle */}
            <button onClick={() => { setLang(l => l === 'en' ? 'bn' : 'en'); setMobileOpen(false); }} className="flex items-center gap-3 text-sm text-[#0b6b3a] hover:bg-white/50 p-3 rounded-xl transition-all duration-200">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-md">
                <Globe className="w-4 h-4" />
              </span>
              <span className="font-semibold">{lang === 'en' ? 'বাংলা' : 'ইংরেজি'}</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-1"></div>

            <Link to="/about" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-base font-semibold no-underline px-3 py-3 rounded-xl text-[#0b6b3a] hover:bg-white/50 transition-all duration-200">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-md">
                <Info className="w-4 h-4" />
              </span>
              {lang === 'en' ? 'About Us' : 'আমাদের সম্পর্কে'}
            </Link>

            {user ? (
              <>
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-1"></div>
                
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 bg-gradient-to-r from-[#0b6b3a] to-[#0d8a4a] text-white px-4 py-3 rounded-xl font-bold no-underline shadow-lg hover:shadow-xl transition-all duration-200">
                  <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <LayoutGrid className="w-5 h-5" />
                  </span>
                  {lang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
                </Link>
                
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#0b6b3a] hover:bg-white/50 transition-all duration-200 font-medium">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white shadow-md">
                    <User className="w-4 h-4" />
                  </span>
                  {lang === 'en' ? 'Profile' : 'প্রোফাইল'}
                </Link>
                
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-3 text-left px-3 py-3 rounded-xl text-red-600 hover:bg-red-50/50 transition-all duration-200 font-medium">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white shadow-md">
                    <LogOut className="w-4 h-4" />
                  </span>
                  {lang === 'en' ? 'Logout' : 'লগআউট'}
                </button>
              </>
            ) : (
              <>
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-1"></div>
                
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#9ef96a] to-[#49c74f] text-[#05310d] rounded-xl px-4 py-3 font-bold no-underline shadow-lg hover:shadow-xl transition-all duration-200">
                  <Sparkles className="w-5 h-5" />
                  {lang === 'en' ? 'Join the Movement' : 'যোগ দিন'}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

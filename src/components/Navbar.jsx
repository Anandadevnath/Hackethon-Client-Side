import React, { useRef, useEffect, useState } from "react";
import logoEn from "../assets/harvest-en-removebg-preview.png";
import logoBn from "../assets/harvest-bn-removebg-preview.png";
import { useLanguage } from "../context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wrapperRef = useRef(null);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/");
  };

  // Close user dropdown click outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Detect scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`${scrolled
          ? "fixed top-0 left-0 right-0"
          : "absolute top-4 left-0 right-0"
        } z-60 transition-all duration-200 box-border ${
        scrolled
          ? "bg-[linear-gradient(90deg,rgba(159,240,177,0.138)_0%,rgba(154,255,126,0.114)_100%)] shadow-[0_6px_20px_rgba(6,40,20,0.12)] backdrop-blur-[11px] backdrop-saturate-120"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-7 py-3 flex items-center justify-between min-h-[72px]">

        {/* Logo */}
        <Link to="/" className="inline-block">
          <img
            src={lang === "en" ? logoEn : logoBn}
            alt="HarvestGuard"
            className="h-[70px] md:h-[90px] block"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">

          {/* Language Switch */}
          <button
            onClick={() => setLang((l) => (l === "en" ? "bn" : "en"))}
            className="flex items-center gap-2 text-sm"
          >
            <span className="text-[#1ecfff] text-[1.2em]">🌐</span>
            <span className="text-[#fffbe6] font-semibold">
              {lang === "en" ? "বাংলা" : "EN"}
            </span>
          </button>

          {/* About */}
          <a
            href="#about"
            className="text-[#fffbe6] text-base font-semibold no-underline px-2 py-1 rounded hover:bg-white/5"
          >
            {lang === "en" ? "About Us" : "আমাদের সম্পর্কে"}
          </a>

          {/* Dashboard Button */}
          {user ? (
            <Link
              to="/dashboard"
              className="bg-white/90 text-[#0b6b3a] px-3 py-2 rounded-[10px] font-bold no-underline shadow-[0_6px_14px_rgba(6,40,20,0.06)]"
            >
              {lang === "en" ? "Dashboard" : "ড্যাশবোর্ড"}
            </Link>
          ) : null}

          {/* User Dropdown */}
          {user ? (
            <div className="relative flex items-center" ref={wrapperRef}>
              <div
                className="flex items-center gap-2 cursor-pointer text-[#fffbe6]"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "Profile"}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white/12"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full inline-flex items-center justify-center bg-black/15 text-[#fffbe6] font-bold">
                    {(user.name && user.name[0]) || "U"}
                  </div>
                )}
                <span className="font-semibold">
                  {user.name || user.email || "User"}
                </span>
              </div>

              <div
                className={`absolute right-0 top-full mt-2 bg-gradient-to-b from-white to-[#fbfff8] text-[#0a4d2c] rounded-[10px] shadow-[0_10px_28px_rgba(6,40,20,0.12)] min-w-[180px] overflow-hidden transition-all duration-150 ${
                  menuOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 translate-y-2 invisible"
                }`}
              >
                <Link
                  to="/dashboard"
                  className="px-4 py-3 block"
                  onClick={() => setMenuOpen(false)}
                >
                  {lang === "en" ? "Dashboard" : "ড্যাশবোর্ড"}
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-3 block"
                  onClick={() => setMenuOpen(false)}
                >
                  {lang === "en" ? "Profile" : "প্রোফাইল"}
                </Link>
                <button className="px-4 py-3 block text-left" onClick={handleLogout}>
                  {lang === "en" ? "Logout" : "লগআউট"}
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-[#9ef96a] to-[#49c74f] text-[#05310d] rounded-[28px] px-4 py-2 font-bold shadow-[0_10px_30px_rgba(46,125,50,0.18),0_0_0_6px_rgba(73,199,79,0.06)] hover:-translate-y-1 transition"
            >
              {lang === "en" ? "Join the Movement" : "যোগ দিন"}
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileNav((p) => !p)}
        >
          {mobileNav ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* MOBILE NAV MENU */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileNav ? "max-h-[350px] opacity-100" : "max-h-0 opacity-0"
        } bg-[#082f1b]/90 backdrop-blur-md`}
      >
        <div className="flex flex-col px-6 py-4 gap-4 text-white">

          <button
            onClick={() => setLang((l) => (l === "en" ? "bn" : "en"))}
            className="text-left text-base font-semibold"
          >
            🌐 {lang === "en" ? "বাংলা" : "EN"}
          </button>

          <a href="#about" className="text-base font-semibold">
            {lang === "en" ? "About Us" : "আমাদের সম্পর্কে"}
          </a>

          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileNav(false)}>
                {lang === "en" ? "Dashboard" : "ড্যাশবোর্ড"}
              </Link>

              <Link to="/profile" onClick={() => setMobileNav(false)}>
                {lang === "en" ? "Profile" : "প্রোফাইল"}
              </Link>

              <button
                className="text-left"
                onClick={() => {
                  setMobileNav(false);
                  handleLogout();
                }}
              >
                {lang === "en" ? "Logout" : "লগআউট"}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileNav(false)}
              className="bg-gradient-to-r from-[#9ef96a] to-[#49c74f] text-[#05310d] rounded-[28px] px-4 py-2 font-bold w-fit"
            >
              {lang === "en" ? "Join the Movement" : "যোগ দিন"}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useEffect, useState } from "react";
import { FaMoon, FaSun, FaBars, FaXmark } from "react-icons/fa6";

export default function Navbar() {
  const [navTheme, setNavTheme] = useState(
    localStorage.getItem("navTheme") || "dark"
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("navTheme", navTheme);
  }, [navTheme]);

  const isLight = navTheme === "light";

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-16 px-4 sm:px-6 md:px-8 flex items-center justify-between z-[9999]
        backdrop-blur-xl border-b shadow-2xl transition-all duration-500 ${
          isLight
            ? "bg-white/95 border-slate-200 text-slate-900"
            : "bg-slate-950/95 border-slate-800 text-white"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)]"></div>

          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent tracking-wide whitespace-nowrap">
            Blood Status Navigator
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center text-lg font-bold gap-2 lg:gap-4">
          <NavItem to="/" label="Home" isLight={isLight} />
          <NavItem to="/admin" label="Admin" isLight={isLight} />
          <NavItem to="/about" label="About" isLight={isLight} />
          <NavItem to="/contact" label="Contact" isLight={isLight} />

          {/* Toggle */}
          <button
            onClick={() => setNavTheme(isLight ? "dark" : "light")}
            className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center border transition duration-300 shadow-md ${
              isLight
                ? "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200"
                : "bg-slate-800 border-slate-600 text-yellow-400 hover:bg-slate-700"
            }`}
          >
            {isLight ? <FaMoon /> : <FaSun />}
          </button>
        </div>

        {/* Mobile Right */}
        <div className="md:hidden flex items-center gap-2">
          {/* Toggle */}
          <button
            onClick={() => setNavTheme(isLight ? "dark" : "light")}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition duration-300 shadow-md ${
              isLight
                ? "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200"
                : "bg-slate-800 border-slate-600 text-yellow-400 hover:bg-slate-700"
            }`}
          >
            {isLight ? <FaMoon /> : <FaSun />}
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition ${
              isLight
                ? "bg-slate-100 border-slate-300 text-slate-800"
                : "bg-slate-800 border-slate-600 text-white"
            }`}
          >
            {menuOpen ? <FaXmark size={20} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`fixed top-16 left-0 w-full z-[9998] px-4 py-4 md:hidden border-b shadow-xl transition-all duration-300 ${
            isLight
              ? "bg-white border-slate-200 text-slate-900"
              : "bg-slate-950 border-slate-800 text-white"
          }`}
        >
          <div className="flex flex-col gap-3">
            <MobileNavItem to="/" label="Home" setMenuOpen={setMenuOpen} isLight={isLight} />
            <MobileNavItem to="/admin" label="Admin" setMenuOpen={setMenuOpen} isLight={isLight} />
            <MobileNavItem to="/about" label="About" setMenuOpen={setMenuOpen} isLight={isLight} />
            <MobileNavItem to="/contact" label="Contact" setMenuOpen={setMenuOpen} isLight={isLight} />
          </div>
        </div>
      )}
    </>
  );
}

function NavItem({ to, label, isLight }) {
  const isActive = window.location.pathname === to;

  return (
    <a href={to} className="relative group px-4 lg:px-6 py-2 rounded-xl overflow-hidden">
      <span
        className={`
        absolute top-0 left-1/2 -translate-x-1/2
        h-[3px] w-0 rounded-full
        bg-gradient-to-r from-red-500 to-red-900
        shadow-[0_0_15px_rgba(239,68,68,0.9)]
        transition-all duration-500
        ${isActive ? "w-8 opacity-100" : "group-hover:w-8 opacity-0 group-hover:opacity-100"}
        `}
      ></span>

      <span
        className={`relative z-10 text-[15px] lg:text-[17px] font-medium transition duration-300 ${
          isActive
            ? isLight
              ? "text-slate-900"
              : "text-white"
            : isLight
            ? "text-slate-700 group-hover:text-red-500"
            : "text-gray-300 group-hover:text-red-400"
        }`}
      >
        {label}
      </span>
    </a>
  );
}

function MobileNavItem({ to, label, setMenuOpen, isLight }) {
  const isActive = window.location.pathname === to;

  return (
    <a
      href={to}
      onClick={() => setMenuOpen(false)}
      className={`w-full px-4 py-3 rounded-xl font-medium transition ${
        isActive
          ? "bg-gradient-to-r from-red-500 to-pink-600 text-white"
          : isLight
          ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
          : "bg-slate-900 text-white hover:bg-slate-800"
      }`}
    >
      {label}
    </a>
  );
}
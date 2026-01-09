import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  Stethoscope, 
  ArrowRight, 
  Home, 
  User, 
  Phone, 
  Calendar, 
  FileText 
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // --- EFFECT: CHECK LOGIN STATUS ---
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  // --- CLOSE MENU ON ROUTE CHANGE/CLICK ---
  const handleNavLinkClick = () => setIsOpen(false);

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setIsOpen(false);
    navigate('/login');
  };

  const navItems = [
    { name: "Home", to: "/", icon: Home },
    { name: "About", to: "/about", icon: User },
    { name: "Contact", to: "/contact", icon: Phone },
    { name: "Appointment", to: "/appointment", icon: Calendar },
    { name: "Reports", to: "/reports", icon: FileText },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-3 md:pt-4 px-3 md:px-0">
      
      {/* --- DESKTOP/MAIN CONTAINER (Glass Panel) --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-5 rounded-2xl md:rounded-full glass-panel py-3 flex justify-between items-center relative z-50">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 font-bold tracking-tight text-slate-800 transition-colors duration-300 group">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110">
            <Stethoscope size={18} strokeWidth={3} className="md:w-5 md:h-5" />
          </div>
          <div className="flex flex-col md:block leading-none">
            <span className="text-base md:text-xl">Shree SamarthKrupa</span>
            <span className="text-xs md:text-xl text-indigo-600 font-extrabold md:font-bold md:ml-1">Dental Clinic</span>
          </div>
        </NavLink>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
          {navItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.to} 
              className={({ isActive }) => 
                `relative hover:text-indigo-600 transition-colors before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:bg-indigo-600 before:transition-all before:duration-300 hover:before:w-full ${isActive ? 'text-indigo-600 before:w-full' : ''}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth & CTA (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/appointment" onClick={handleNavLinkClick} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-500/30 transform hover:-translate-y-0.5 active:scale-95">
              Book Appointment <ArrowRight size={16} />
          </NavLink>
          {isLoggedIn && (
             <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-700">Logout</button>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden p-2 text-slate-800 transition-all duration-300 rounded-lg active:bg-slate-100"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? (
            <X size={24} className="text-indigo-600" />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* --- MOBILE MENU (Enhanced UI) --- */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-full left-0 right-0 px-3 mt-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? "max-h-[500px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4"
        }`}
      >
        <div className="glass-panel rounded-2xl p-4 shadow-2xl backdrop-blur-xl border-t border-white/50">
          <ul className="flex flex-col space-y-1">
            {navItems.map((item, index) => (
              <li
                key={item.name}
                style={{ transitionDelay: isOpen ? `${index * 50}ms` : "0ms" }}
                className={`transform transition-all duration-300 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
              >
                <NavLink
                  to={item.to}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm ring-1 ring-indigo-100' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                    }`
                  }
                >
                  {/* FIX: Using render prop to access isActive for the icon */}
                  {({ isActive }) => (
                    <>
                      <item.icon size={20} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                      {item.name}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
             {/* Mobile Book Appointment CTA */}
             <NavLink 
                to="/appointment" 
                onClick={handleNavLinkClick} 
                className="flex w-full items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
             >
                Book Appointment <ArrowRight size={18} />
             </NavLink>

            {/* Mobile Logout */}
            {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
            )}
          </div>
        </div>
      </div>
      
      {/* --- GLOBAL STYLES --- */}
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
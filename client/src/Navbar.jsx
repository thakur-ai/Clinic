import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import { Menu, X, Stethoscope, ArrowRight } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const navigate = useNavigate(); // Initialize useNavigate

  // --- EFFECT: CHECK LOGIN STATUS ON MOUNT AND ON LOCAL STORAGE CHANGE ---
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
    };

    checkLoginStatus(); // Check on component mount

    window.addEventListener('storage', checkLoginStatus); // Listen for changes in localStorage
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  // --- CLOSE MENU ON ROUTE CHANGE/CLICK ---
  const handleNavLinkClick = () => setIsOpen(false);

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token
    setIsLoggedIn(false); // Update login status
    setIsOpen(false); // Close mobile menu if open
    navigate('/login'); // Redirect to login page after logout
  };

  const navItems = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
    { name: "Appointment", to: "/appointment" },
    { name: "Reports", to: "/reports" },
    // Removed "Admin" link
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4">
      
      {/* --- DESKTOP/MAIN CONTAINER (Glass Panel) --- */}
      <div className="max-w-7xl mx-auto px-5 rounded-full glass-panel py-2 md:py-3 flex justify-between items-center">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800 transition-colors duration-300">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transition-transform duration-300 hover:scale-110">
            <Stethoscope size={18} strokeWidth={3} />
          </div>
          Shree SamarthKrupa <span className="text-indigo-600">Dental Clinic</span>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
          {navItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.to} 
              // Added active class styling
              className={({ isActive }) => 
                `relative hover:text-indigo-600 transition-colors before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:bg-indigo-600 before:transition-all before:duration-300 hover:before:w-full ${isActive ? 'text-indigo-600 before:w-full' : ''}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Auth Button (Logout if logged in) & CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          {/* Book Appointment CTA */}
          <NavLink to="/appointment" onClick={handleNavLinkClick} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-500/30 transform hover:-translate-y-0.5 active:scale-95">
                Book Appointment <ArrowRight size={16} />
            </NavLink>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-slate-800 transition-all duration-300 transform active:scale-90"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? (
            <X size={28} className="transition-transform duration-300 transform rotate-90" />
          ) : (
            <Menu size={28} className="transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* --- MOBILE MENU (Smooth, Staggered Reveal) --- */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-80 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-2 p-4 glass-panel rounded-lg mx-4">
          {navItems.map((item, index) => (
            <li
              key={item.name}
              className={`transition-all duration-500 ease-out ${
                isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[-10px]"
              }`}
              style={{ transitionDelay: isOpen ? `${index * 50}ms` : "0ms" }}
            >
              <NavLink
                to={item.to}
                onClick={handleNavLinkClick}
                className={({ isActive }) => 
                  `block text-left text-slate-700 px-4 py-3 rounded-xl hover:bg-indigo-50/70 transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
          {/* Mobile Logout Button (only if logged in) */}
          {isLoggedIn && (
            <li className="pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-red-600 text-white text-base font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 active:scale-[0.98]"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
      
      {/* --- GLOBAL STYLES (Kept for Glassmorphism) --- */}
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </nav>
  );
};
//op
export default Navbar;

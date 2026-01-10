import React from "react";
import { FaInstagram, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { FiPhoneCall, FiChevronRight } from "react-icons/fi";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-200 pt-16 pb-8 font-sans border-t border-slate-900">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <h2 className="text-2xl lg:text-3xl text-white font-extrabold tracking-tight">
            Clinic Name
            <span className="text-blue-500">.</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
            Your trusted healthcare partner. Providing exceptional medical
            services with care, compassion, and cutting-edge technology.
          </p>
          {/* Subtle decoration */}
          <div className="h-1 w-12 bg-blue-600 rounded-full mt-4"></div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg text-white font-bold mb-6 flex items-center gap-2">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
              { label: "About Us", href: "/about" },
              { label: "Book Appointment", href: "/appointment", highlight: true },
            ].map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.href}
                  className={`group flex items-center text-sm font-medium transition-all duration-200 ${
                    link.highlight 
                      ? "text-blue-400 hover:text-blue-300" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-blue-500 mr-2">
                    <FiChevronRight />
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-lg text-white font-bold mb-6">Connect with us</h3>
          
          <div className="space-y-4">
             {/* Address */}
             <div className="flex items-start gap-3 text-sm text-slate-400 group">
                <FaMapMarkerAlt className="mt-1 text-blue-500 shrink-0 group-hover:text-blue-400 transition-colors" />
                <p className="leading-relaxed group-hover:text-slate-200 transition-colors">
                  Shop No 2, Vishwavihar Apt, <br/>
                  Near Lijjat Papad Shop, <br/>
                  Ganesh Chawk Manjarli, <br/>
                  Badlapur West
                </p>
             </div>

             {/* Phone */}
             <a
              href="tel:+917378670369"
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group"
             >
                <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <FiPhoneCall />
                </div>
                <span>+91 7378670369</span>
             </a>

             {/* Email */}
             <a
              href="mailto:bhagupatil10@gmail.com"
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group"
             >
                <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <MdEmail />
                </div>
                <span className="truncate">bhagupatil10@gmail.com</span>
             </a>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 mt-6">
            <a
              href="https://www.instagram.com/shreesamarthkrupadentalclinic/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-purple-500 hover:to-blue-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://wa.me/917378670369"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:bg-[#25D366] hover:text-white transition-all duration-300 shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-1"
            >
              <FaWhatsapp size={18} />
            </a>
            <a
              href="mailto:bhagupatil10@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1"
            >
              <MdEmail size={18} />
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg text-white font-bold mb-6">Our Location</h3>
          <div className="w-full h-48 lg:h-full min-h-[180px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative group">
            {/* Overlay for hover effect */}
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 pointer-events-none transition-colors z-10"></div>
            <iframe
              title="Clinic Location"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(85%)" }} // Stylish dark map filter
              src="https://maps.google.com/maps?q=19.167520,73.220860&z=15&output=embed"
              allowFullScreen
              loading="lazy"
              className="group-hover:grayscale-0 group-hover:invert-0 group-hover:contrast-100 transition-all duration-500"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-slate-900 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">Om B. Patil</span>. All rights reserved.
        </p>
        <div className="mt-2 md:mt-0 flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
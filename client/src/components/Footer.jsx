import React from "react";
import { FaInstagram, FaLinkedinIn} from "react-icons/fa";
import { FiPhoneCall} from "react-icons/fi";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-11 pb-7 font-'Montserrat'">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-xl md:text-2xl text-white font-bold mb-4">Clinic Name</h2>
          <p className="text-xs md:text-sm font-semibold text-gray-400">
            Your trusted healthcare partner. Providing exceptional medical
            services with care and compassion.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg md:text-xl text-white font-semibold mb-4">Quick Links</h3>
          <ul
            className="space-y-2 text-xs md:text-sm font-semibold text-gray-400"
          >
            <li>
              <a
                className="text-gray-400 font-semibold"
                href="/"
              >
                Home
              </a>
            </li>
            <li>
              <a
                className="text-gray-400 font-semibold"
                href="/services"
              >
                Services
              </a>
            </li>
            <li>
              <a
                className="text-gray-400 font-semibold"
                href="/contact"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                className="text-gray-400"
                href="/about"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                className="text-gray-400 font-semibold mt-1"
                href="/appointment"
              >
                Book Appointment
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-lg md:text-xl text-white font-semibold mb-4">
            Connect with us
          </h3>
          <p className="text-xs md:text-sm font-semibold text-gray-400 mb-2">
            shop no 2, Vishwavihar apt , near lijjat papad shop , ganesh chawk manjarli ,badlapur west
          </p>
          <a
            href="tel:+1234567890"
            className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-400 mb-2"
          >
            <span
              className="inline-flex"
            >
              <FiPhoneCall className="text-xs md:text-sm text-gray-400" />
            </span>
            <span>Phone: +91 7378670369</span>
          </a>
          <a
            href="mailto:bhagupatil10@gmail.com"
            className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-400 mb-4"
          >
            <span
              className="inline-flex"
            >
              <MdEmail className="text-xs md:text-sm text-gray-400" />
            </span>
            <span>Email: bhagupatil10@gmail.com</span>
          </a>
          {/* Social Media Icons */}
          <div className="flex font-semibold  space-x-4 text-base md:text-lg mb-4">
            <a
              href="https://www.instagram.com/shreesamarthkrupadentalclinic/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="bg-gray-800 text-white rounded-full p-2 shadow-md"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/917378670369"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="bg-gray-800 text-white rounded-full p-2 shadow-md"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="bg-gray-800 text-white rounded-full p-2 shadow-md"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Map */}
        <div>
          <h3 className="text-lg md:text-xl text-white font-semibold mb-4">
            Our Location
          </h3>
          <div className="w-full h-48 overflow-hidden rounded-xl border  border-gray-400">
            <iframe
    title="Clinic Location"
    width="100%"
    height="100%"
    frameBorder="0"
    style={{ border: 0 }}
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.200569727581!2d-122.41941578468128!3d37.77492977975924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808796f6e5e7%3A0x77c4424e881e1388!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1678901234567!5m2!1sen!2sin"
    allowFullScreen
  ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-black bg-black mt-8 pt-4 text-center text-xs md:text-sm text-gray-400">
        © {new Date().getFullYear()} Om . B . Patil. All rights reserved. Icons by <a href="https://fontawesome.com/" target="_blank" rel="noopener noreferrer" className="underline">Font Awesome</a>.
      </div>
    </footer>
  );
};
//op
export default Footer;

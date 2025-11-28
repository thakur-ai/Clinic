import React, { useState, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { 
  Phone, 
  MapPin, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Send, 
  CheckCircle,
  AlertCircle,
  Building,
  User,
  FileText,
  MessageSquare,
  ChevronDown
} from 'lucide-react';

// --- FLOATING INPUT COMPONENT (Optimized for Mobile Touch) ---
const FloatingInput = ({ icon: Icon, label, name, type = "text", value, onChange, required = false, options = null }) => {
  const inputId = `floating-input-${name}`;

  return (
    <div className="relative group">
      {/* Icon Wrapper - Absolute positioning centered vertically */}
      <div className="absolute top-0 bottom-0 left-4 flex items-center pointer-events-none z-10 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300">
        <Icon className="w-5 h-5" />
      </div>

      {type === 'select' ? (
        <div className="relative">
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="peer w-full h-14 pl-12 pr-10 pt-4 pb-1 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 appearance-none cursor-pointer text-base shadow-sm"
          >
            <option value="" disabled hidden></option>
            {options && options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <label 
            htmlFor={inputId}
            className={`absolute left-12 transition-all duration-300 pointer-events-none origin-[0] font-medium
            ${value 
              ? 'top-2.5 text-[10px] text-blue-600 uppercase tracking-wider font-bold transform -translate-y-0' 
              : 'top-1/2 -translate-y-1/2 text-sm text-slate-500'}`}
          >
            {label}
          </label>
           <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      ) : type === 'textarea' ? (
         <div className="relative">
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            rows="4"
            placeholder=" "
            className="peer w-full min-h-[140px] pl-12 pr-4 pt-6 pb-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 resize-none text-base shadow-sm"
            autoComplete="off" 
            spellCheck="false"
          ></textarea>
           <label 
            htmlFor={inputId}
            className="absolute left-12 top-2.5 text-[10px] font-bold text-blue-600 uppercase tracking-wider transition-all duration-300 origin-[0]
            peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:text-slate-500 peer-placeholder-shown:font-medium
            peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:text-blue-600 peer-focus:font-bold peer-focus:uppercase"
           >
            {label}
          </label>
        </div>
      ) : (
        <div className="relative">
          <input
            id={inputId}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder=" "
            className="peer w-full h-14 pl-12 pr-4 pt-4 pb-1 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base shadow-sm placeholder-transparent"
            autoComplete="off" 
            spellCheck="false"
          />
          <label 
            htmlFor={inputId}
            className="absolute left-12 top-2.5 text-[10px] font-bold text-blue-600 uppercase tracking-wider transition-all duration-300 origin-[0]
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:text-slate-500 peer-placeholder-shown:font-medium
            peer-focus:top-2.5 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:text-blue-600 peer-focus:font-bold peer-focus:uppercase"
          >
            {label}
          </label>
        </div>
      )}
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
    recaptchaToken: "",
  });

  const [status, setStatus] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [recaptchaSize, setRecaptchaSize] = useState("normal"); // State for reCAPTCHA size

  useEffect(() => {
    setIsVisible(true);

    // Function to update reCAPTCHA size based on screen width
    const updateRecaptchaSize = () => {
      if (window.innerWidth < 480) { // Adjust breakpoint for better mobile fit
        setRecaptchaSize("compact");
      } else {
        setRecaptchaSize("normal");
      }
    };

    updateRecaptchaSize(); // Set initial size
    window.addEventListener("resize", updateRecaptchaSize); // Add resize listener

    return () => window.removeEventListener("resize", updateRecaptchaSize); // Cleanup
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRecaptchaChange = (token) => {
    setFormData((prev) => ({ ...prev, recaptchaToken: token }));
  };

  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    if (!formData.recaptchaToken) {
      setStatus("error_captcha");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setStatus("error_phone");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, recaptchaToken: formData.recaptchaToken }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          inquiryType: "",
          message: "",
          recaptchaToken: "",
        });
      } else {
        setStatus("error_send");
      }
    } catch (error) {
      console.error("Error sending contact form:", error);
      setStatus("error_network");
    }
  };

  const socialLinks = [
    { icon: Facebook, href: "#", color: "text-[#1877F2] bg-blue-50 hover:bg-[#1877F2] hover:text-white" },
    { icon: Instagram, href: "#", color: "text-[#E4405F] bg-pink-50 hover:bg-[#E4405F] hover:text-white" },
    { icon: Twitter, href: "#", color: "text-[#1DA1F2] bg-sky-50 hover:bg-[#1DA1F2] hover:text-white" },
    { icon: Linkedin, href: "#", color: "text-[#0A66C2] bg-blue-50 hover:bg-[#0A66C2] hover:text-white" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 py-4 px-0 sm:py-8 sm:px-6 md:px-8 font-sans overflow-x-hidden selection:bg-blue-200 selection:text-blue-900">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-200/30 rounded-full blur-[80px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mt-8 mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center p-3 mb-4 bg-white rounded-2xl shadow-lg shadow-blue-500/10 ring-1 ring-slate-100">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-inner">
                 <Building className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight leading-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Touch</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed px-4">
            We'd love to hear from you. Our team is ready to answer any questions.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-white/50 backdrop-blur-sm">
          
          {/* Left Panel: Info (Dark Mode Card) */}
          <div className="relative lg:w-5/12 bg-slate-900 p-6 sm:p-8 md:p-12 overflow-hidden flex flex-col justify-between min-h-[400px]">
            {/* Dark Mode Background Effects */}
            <div className="absolute inset-0 z-0">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-[64px] opacity-20"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-[64px] opacity-20"></div>
               {/* Noise Texture */}
               <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                Contact Info
              </h2>
              <p className="text-slate-400 mb-8 text-sm md:text-base leading-relaxed">
                Reach out to us directly through any of these channels.
              </p>

              <div className="space-y-4">
                <a href="#" className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-white">Visit Us</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Sharda Chowk, Amravati, India</p>
                  </div>
                </a>

                <a href="tel:+919876543210" className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-white">Call Us</h3>
                    <p className="text-xs text-slate-400 mt-0.5">+91 98765 43210</p>
                  </div>
                </a>

                <a href="mailto:info@gouriinn.com" className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                   <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold text-white">Email Us</h3>
                    <p className="text-xs text-slate-400 mt-0.5">info@gouriinn.com</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="relative z-10 mt-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Social Media</p>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, color }, idx) => (
                  <a 
                    key={idx} 
                    href={href} 
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="lg:w-7/12 p-6 sm:p-8 md:p-12 relative bg-white">
            <div className="max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Send a Message</h2>
              <p className="text-slate-500 text-sm mb-8">We usually respond within 24 hours.</p>

              {/* Status Messages */}
              {status && (
                <div className={`mb-8 p-4 rounded-2xl flex items-start gap-3 text-sm font-medium animate-fade-in ${
                  status === "success" ? "bg-green-50 text-green-700 border border-green-100" : 
                  status.startsWith("error") ? "bg-red-50 text-red-700 border border-red-100" :
                  "bg-blue-50 text-blue-700 border border-blue-100"
                }`}>
                  <div className={`p-1 rounded-full mt-0.5 shrink-0 ${
                    status === "success" ? "bg-green-200" : 
                    status.startsWith("error") ? "bg-red-200" :
                    "bg-blue-200"
                  }`}>
                    {status === "success" && <CheckCircle className="w-3 h-3 text-green-700" />}
                    {status.startsWith("error") && <AlertCircle className="w-3 h-3 text-red-700" />}
                    {status === "Sending..." && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin text-blue-700"></div>}
                  </div>
                  <span className="leading-snug">
                    {status === "success" && "Message sent successfully! We'll get back to you soon."}
                    {status === "error_captcha" && "Please complete the CAPTCHA verification."}
                    {status === "error_phone" && "Please enter a valid 10-digit Indian phone number."}
                    {status === "error_send" && "Failed to send message. Please try again later."}
                    {status === "error_network" && "Network error. Please check your connection and try again."}
                    {status === "Sending..." && "Sending your message..."}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput 
                    icon={User}
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <FloatingInput 
                    icon={Phone}
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput 
                    icon={Mail}
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <FloatingInput 
                    icon={FileText}
                    label="Inquiry Type"
                    name="inquiryType"
                    type="select"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    options={[
                      { value: 'Booking', label: 'Room Booking' },
                      { value: 'Support', label: 'Service Support' },
                      { value: 'Feedback', label: 'Feedback' },
                      { value: 'Other', label: 'Other Inquiry' }
                    ]}
                  />
                </div>

                <FloatingInput 
                  icon={MessageSquare}
                  label="Message"
                  name="message"
                  type="textarea"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

                <div className="pt-2 flex justify-center w-full max-w-full overflow-hidden mx-auto">
                  <div className="recaptcha-wrapper">
                    <ReCAPTCHA
                      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                      onChange={handleRecaptchaChange}
                      size={recaptchaSize}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "Sending..." || !formData.recaptchaToken}
                  className="w-full relative overflow-hidden bg-slate-900 text-white py-4 rounded-2xl font-bold text-base shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-slate-900/20 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {status === "Sending..." ? "Sending..." : <>Send Message <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Floating WhatsApp */}
      <a
        href="https://wa.me/919876543210" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pl-4 pr-1 py-1 bg-white rounded-full shadow-2xl shadow-green-900/20 border border-green-100 hover:-translate-y-1 transition-all duration-300 group"
        style={{ transitionDelay: '800ms' }}
      >
        <span className="text-sm font-bold text-slate-700 group-hover:text-green-600 transition-colors">Chat with us</span>
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
           <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </div>
      </a>

      <style jsx="true">{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation: blob 7s infinite;
        }
         @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        /* Responsive reCAPTCHA scaling for very small screens */
        @media (max-width: 340px) { /* Adjust breakpoint as needed */
          .recaptcha-wrapper {
            transform: scale(0.85); /* Adjust scale factor as needed */
            transform-origin: center;
          }
        }
        @media (max-width: 300px) { /* Adjust breakpoint as needed */
          .recaptcha-wrapper {
            transform: scale(0.75); /* Adjust scale factor as needed */
            transform-origin: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;

import React, { useState, useEffect, useRef } from "react";
import {
  Award,
  MapPin,
  CheckCircle2,
  Sparkles,
  Star,
  Instagram,
  MessageCircle,
  Mail,
} from "lucide-react";

// --- COMPONENT: Scroll Reveal Wrapper ---
const ScrollReveal = ({ children, delay = 0, width = "100%" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ width, transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

const AboutPage = () => {
  // --- MOUSE PARALLAX LOGIC ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y, rawX: e.clientX, rawY: e.clientY });
    };
    // Only add mouse tracking on larger screens to save mobile battery
    if (window.innerWidth > 768) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const tiltX = mousePos.y * 10;
  const tiltY = mousePos.x * -10;

  // --- DATA ---
  const doctors = [
    {
      id: 1,
      name: "Dr. Karishma",
      role: "Endodontist",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Dr. Anurag",
      role: "Orthodontist",
      image: "/Anurag.jpeg",
    },
    {
      id: 3,
      name: "Dr. Sachin",
      role: "Oral Surgeon",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "Dr. Rupali",
      role: "Pedodontist",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "Dr. Sneha",
      role: "Prosthodontist",
      image: "/Sneha.jpeg",
    },
  ];

  const timeline = [
    {
      year: "2022",
      title: "We Started",
      desc: "Started clinic by bringing Dental awareness among people.",
    },
    {
      year: "2023",
      title: "Our First Setup",
      desc: "First clinic started at Vishwavihar apt, near lijjat papad shop, ganesh chawk manjarli, badlapur west.",
    },
    {
      year: "2025",
      title: "Expansion",
      desc: "Second clinic started at Chakrapani apt. Katrap, opposite to katrap signal, ghorpade chawk, badlapur east.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 relative overflow-x-hidden pt-0 md:pt-2">
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05);
        }
        .text-gradient {
          background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        /* Mobile Float Animation for Hero Image */
        .mobile-float { animation: float 8s ease-in-out infinite; }

        /* Desktop Timeline Line */
        @media (min-width: 768px) {
          .timeline-line::before {
            content: '';
            position: absolute;
            top: 0; bottom: 0; left: 50%;
            width: 2px; background: #e2e8f0;
            transform: translateX(-50%);
          }
        }
        /* Mobile Timeline Line */
        @media (max-width: 767px) {
          .timeline-line::before {
            content: '';
            position: absolute;
            top: 0; bottom: 0; left: 24px; /* Adjusted for better alignment */
            width: 2px; background: #e2e8f0;
          }
        }
      `}</style>

      {/* =========================================
          BACKGROUND LAYERS
         ========================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        {/* Spotlight (Hidden on mobile to save battery) */}
        <div
          className="hidden md:block absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 transition-transform duration-75 ease-out"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
            left: -400,
            top: -400,
            transform: `translate(${mousePos.rawX}px, ${mousePos.rawY}px)`,
          }}
        />
        {/* Static Blobs for Mobile */}
        <div className="absolute top-0 right-0 w-[200px] md:w-[600px] h-[200px] md:h-[600px] bg-indigo-100/50 rounded-full blur-[60px] md:blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[500px] h-[200px] md:h-[500px] bg-blue-100/50 rounded-full blur-[60px] md:blur-[100px]"></div>
      </div>

      {/* =========================================
          HERO SECTION
         ========================================= */}
      <section className="relative z-10 py-10 md:py-20 lg:py-15 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Left: Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left order-1 lg:order-1">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-600 text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-sm">
                <Sparkles size={12} /> Since 2022
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Redefining <br />
                <span className="text-gradient">Dental Care.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <p className="text-base sm:text-lg md:text-xl text-slate-500 leading-relaxed font-medium max-w-md mx-auto lg:mx-0">
                Advanced robotics meets human compassion. Engineering
                confidence, one smile at a time.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-200 overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="user"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    5k+
                  </div>
                </div>
                <div>
                  <div className="flex text-yellow-500 text-xs gap-1 justify-center lg:justify-start">
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    Trusted by Patients
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: 3D Image Composition */}
          {/* Mobile: Order 2. On very small screens, reduced height to save space */}
          <div className="relative h-[320px] md:h-[500px] w-full flex items-center justify-center perspective-[1000px] order-2 lg:order-2 mt-4 lg:mt-0">
            <ScrollReveal delay={300} width="100%">
              <div
                className={`relative z-20 w-full h-[320px] md:h-[500px] bg-slate-200 rounded-[2rem] shadow-xl overflow-hidden transform transition-transform duration-100 ease-out ${
                  window.innerWidth <= 768 ? "mobile-float" : ""
                }`}
                style={{
                  // Only apply tilt on desktop to prevent mobile motion sickness/bugs
                  transform:
                    window.innerWidth > 768
                      ? `rotateY(${tiltY}deg) rotateX(${tiltX}deg)`
                      : "none",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
                  alt="Modern Clinic"
                  className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-bold text-sm md:text-base flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-400" />{" "}
                    Headquarters
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 right-2 md:-bottom-6 md:-left-6 glass-card p-3 md:p-4 rounded-xl animate-float z-30 transform scale-90 md:scale-100 origin-bottom-right md:origin-center">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Awarded
                    </p>
                    <p className="text-sm md:text-base font-black text-slate-900">
                      #1 Clinic
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          OUR JOURNEY (TIMELINE)
         ========================================= */}
      <section className="relative z-10 py-12 px-4 max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
              Our Journey
            </h2>
            <p className="text-slate-500 text-base">Growth & Excellence.</p>
          </div>
        </ScrollReveal>

        <div className="relative timeline-line pl-0 md:pl-4">
          {timeline.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 w-full ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Spacer for Desktop Layout */}
              <div className="hidden md:block w-5/12"></div>

              {/* Dot - Adjusted left positioning for mobile to align with the CSS line */}
              <div className="absolute left-[15px] md:relative md:left-auto z-10 bg-indigo-600 text-white w-5 h-5 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-[8px] md:text-xs shadow-lg border-2 md:border-4 border-white shrink-0 mt-1 md:mt-0">
                <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
              </div>

              {/* Content Card - Added proper left padding for mobile to clear the line */}
              <div className="w-full md:w-5/12 pl-10 md:pl-0">
                <ScrollReveal delay={index * 100}>
                  <div className="glass-card p-5 rounded-2xl hover:bg-white active:bg-white transition-colors duration-300 relative group">
                    <span className="text-indigo-600 font-black text-lg block mb-1">
                      {item.year}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          MEET THE EXPERTS
         ========================================= */}
      <section className="relative z-10 py-12 md:py-20 px-4 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
              The Dream Team
            </h2>
            <p className="text-slate-500 text-base">
              Top specialists dedicated to you.
            </p>
          </div>
        </ScrollReveal>

        {/* Mobile: Grid cols 2 (side by side) looks better than 1 big column. Desktop: 5 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6">
          {doctors.map((doc, index) => (
            <ScrollReveal key={doc.id} delay={index * 100}>
              <div className="group glass-card rounded-2xl md:rounded-[1.5rem] overflow-hidden hover:shadow-xl transition-all duration-300 active:scale-95 md:active:scale-100">
                <div className="relative h-40 md:h-60 overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/20 transition-colors duration-300 z-10"></div>
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Social Icons - Visible on Mobile bottom, Animated on Desktop */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 md:gap-3 md:translate-y-12 md:group-hover:translate-y-0 transition-transform duration-300 z-20">
                    <div className="bg-white p-1 md:p-1.5 rounded-full shadow-sm text-slate-700">
                      <Instagram size={12} className="md:w-3.5 md:h-3.5" />
                    </div>
                    <div className="bg-white p-1 md:p-1.5 rounded-full shadow-sm text-slate-700">
                      <MessageCircle size={12} className="md:w-3.5 md:h-3.5" />
                    </div>
                  </div>
                </div>

                <div className="p-3 md:p-5 text-center">
                  {/* Name size adjusted for mobile 2-col layout */}
                  <h3 className="text-sm md:text-lg font-bold text-slate-900 truncate">
                    {doc.name}
                  </h3>
                  <p className="text-indigo-600 font-bold text-[9px] md:text-[10px] uppercase tracking-widest mb-1 md:mb-2 truncate">
                    {doc.role}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-12"></div>
    </div>
  );
};

export default AboutPage;

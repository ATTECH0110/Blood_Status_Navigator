import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaHeart,
  FaArrowUpRightFromSquare,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="relative mt-16 sm:mt-20 md:mt-24 border-t border-white/10 bg-slate-950 overflow-hidden">
      
      {/* ================= BACKGROUND IMAGE ================= */}
      <div className="absolute inset-0 bg-[url('/images/footer-bg.jpg')] bg-cover bg-center opacity-45"></div>
<div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-950/60 to-black/75"></div>
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-52 h-52 sm:w-72 sm:h-72 bg-red-500/10 blur-3xl rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-52 h-52 sm:w-72 sm:h-72 bg-pink-500/10 blur-3xl rounded-full -z-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10 sm:py-12 md:py-14">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-10">
          
          {/* BRAND */}
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                🩸
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                Blood Status Navigator
              </h2>
            </div>

            <p className="text-slate-400 leading-7 text-sm max-w-sm mx-auto sm:mx-0">
              A real-time blood availability platform helping hospitals and
              patients connect faster during emergencies.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full">
              Saving lives with smarter access
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold text-lg mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", to: "/" },
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Admin", to: "/admin" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-2 text-slate-400 hover:text-white transition"
                  >
                    <span>{item.label}</span>
                    <FaArrowUpRightFromSquare className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold text-lg mb-5">Contact</h3>

            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition duration-300 shrink-0">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Email</p>
                  <a
                    href="mailto:support@bloodstatus.com"
                    className="hover:text-red-400 transition break-all"
                  >
                    support@bloodstatus.com
                  </a>
                </div>
              </li>

              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition duration-300 shrink-0">
                  <FaPhone />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Phone</p>
                  <a
                    href="tel:+917394827627"
                    className="hover:text-red-400 transition"
                  >
                    +91 7394827627
                  </a>
                </div>
              </li>

              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition duration-300 shrink-0">
                  <FaLocationDot />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Location</p>
                  <a
                    href="https://www.google.com/maps?q=Lucknow,India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-400 transition"
                  >
                    Lucknow, Uttar Pradesh, India
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold text-lg mb-5">Follow Us</h3>

            <p className="text-slate-400 text-sm leading-7 mb-5 max-w-sm mx-auto sm:mx-0">
              Stay connected with updates, awareness campaigns and future
              features.
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <SocialIcon
                href="/"
                icon={<FaFacebookF />}
                hover="hover:bg-blue-600"
              />
              <SocialIcon
                href="https://www.instagram.com/chandan_0110_a_t_singh?igsh=MXRyNWFrbnEzMnZyaA=="
                icon={<FaInstagram />}
                hover="hover:bg-pink-500"
              />
              <SocialIcon
                href="https://x.com/acs01108787"
                icon={<FaTwitter />}
                hover="hover:bg-sky-500"
              />
              <SocialIcon
                href="https://www.linkedin.com/in/chandan-singh-5a4007330"
                icon={<FaLinkedinIn />}
                hover="hover:bg-blue-500"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} Blood Status Navigator. All rights
            reserved.
          </p>

          <div className="flex items-center gap-2 text-slate-400 flex-wrap justify-center">
            <span>Built with</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span>for emergency care access</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon, hover }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-slate-300 ${hover} hover:text-white transition duration-300 shadow-lg`}
    >
      {icon}
    </a>
  );
}
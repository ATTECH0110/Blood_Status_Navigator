import React from "react";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function About() {
  return (
    <div className="w-full min-h-screen text-white relative overflow-hidden bg-slate-950">

      {/* GLOBAL BACKGROUND OVERLAY */}
      <div className="absolute inset-0 bg-[url('/images/about-bg.jpg')] bg-cover bg-center opacity-35"></div>
      <div className="absolute inset-0 bg-slate-950/65"></div>

      <div className="relative z-10">
        {/* ================= HERO ================= */}
        <section className="pt-24 sm:pt-28 pb-14 sm:pb-20 text-center px-4 sm:px-6 relative overflow-hidden">

          <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-red-600 blur-3xl opacity-20 rounded-full -z-10"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-pink-600 blur-3xl opacity-20 rounded-full -z-10"></div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            About Blood Status Navigator
          </h1>

          <p className="text-gray-300 max-w-3xl mx-auto leading-7 sm:leading-8 text-sm sm:text-base md:text-lg px-2">
            Blood Status Navigator is a real-time blood tracking system
            designed to connect hospitals and patients efficiently.
            Our mission is to reduce emergency delays and help save lives
            through smart technology.
          </p>
        </section>

        {/* ================= MISSION & VISION ================= */}
        <section className="px-4 sm:px-6 md:px-8 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-6 md:p-8 rounded-2xl shadow-xl hover:scale-[1.02] transition duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-300 leading-7 text-sm sm:text-base">
                To create a seamless and reliable blood availability
                tracking system that ensures timely support during
                medical emergencies.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-6 md:p-8 rounded-2xl shadow-xl hover:scale-[1.02] transition duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-300 leading-7 text-sm sm:text-base">
                To build a nationwide digital network connecting
                hospitals and donors with real-time transparency
                and intelligent management.
              </p>
            </div>

          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="px-4 sm:px-6 md:px-8 pb-16 sm:pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">
            What Makes Us Different?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

            <FeatureCard
              title="Real-Time Updates"
              desc="Live blood stock visibility across all hospitals."
            />

            <FeatureCard
              title="Smart Location Tracking"
              desc="Find the nearest available blood units instantly."
            />

            <FeatureCard
              title="Secure Admin Control"
              desc="Request approval and stock management system."
            />

          </div>
        </section>

        {/* ================= TEAM ================= */}
        <section className="px-4 sm:px-6 md:px-8 pb-20 sm:pb-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 sm:mb-12">
            Our Development Team
          </h2>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">

            <TeamCard
              name="Chandan Singh"
              role="Full Stack Developer"
              img="/images/chandan.jpg"
              linkedin="https://linkedin.com/in/chandan"
              instagram="https://instagram.com/chandan"
            />

            <TeamCard
              name="Priyanshu Verma"
              role="Backend Developer"
              img="/images/priyanshu.jpg"
              linkedin="https://linkedin.com/in/priyanshu"
              instagram="https://instagram.com/priyanshu"
            />

            <TeamCard
              name="Nirmal Maurya"
              role="Frontend Developer"
              img="/images/nirmal.jpg"
              linkedin="https://linkedin.com/in/nirmal"
              instagram="https://instagram.com/nirmal"
            />

            <TeamCard
              name="Ritesh Kushwaha"
              role="Database Engineer"
              img="/images/ritesh.jpg"
              linkedin="https://linkedin.com/in/ritesh"
              instagram="https://instagram.com/ritesh"
            />

            <TeamCard
              name="Abhinav Singh"
              role="UI/UX Designer"
              img="/images/abhinav.jpg"
              linkedin="https://linkedin.com/in/abhinav"
              instagram="https://instagram.com/in/abhinav"
            />

          </div>
        </section>
      </div>
    </div>
  );
}

/* ================= FEATURE CARD ================= */
function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:scale-[1.02] transition duration-300">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-red-400">
        {title}
      </h3>
      <p className="text-gray-300 leading-7 text-sm sm:text-base">{desc}</p>
    </div>
  );
}

/* ================= TEAM CARD ================= */
function TeamCard({ name, role, img, linkedin, instagram }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-6 rounded-2xl shadow-xl w-full max-w-[260px] hover:scale-[1.02] transition duration-300">

      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-red-500 shadow-lg">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-base sm:text-lg font-semibold">{name}</h3>
      <p className="text-gray-400 text-sm mt-2">{role}</p>

      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={() => window.open(linkedin, "_blank")}
          className="w-9 h-9 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md"
        >
          <FaLinkedinIn />
        </button>

        <button
          onClick={() => window.open(instagram, "_blank")}
          className="w-9 h-9 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-pink-400 hover:bg-pink-500 hover:text-white transition duration-300 shadow-md"
        >
          <FaInstagram />
        </button>
      </div>
    </div>
  );
}
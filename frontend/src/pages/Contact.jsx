import contactBg from "../assets/images/contact-bg.jpg";
import React, {useState} from "react";
import API from "../config";

export default function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  // ✅ SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault(); // 🔥 बहुत जरूरी

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      console.log(data);

      alert("Message sent successfully ✅");

      // reset
      setForm({
        name: "",
        email: "",
        message: ""
      });

    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    }
  };


  return (
    <div className="w-full text-white relative overflow-hidden bg-slate-950 pb-0">
      
      {/* ================= BACKGROUND IMAGE ================= */}
      <div style ={{backgroundImage:`url(${contactBg})`,backgroundSize:"cover",backgroundPosition:"centre"}} className="absolute inset-0  opacity-40"></div>
      <div className="absolute inset-0 bg-slate-950/70"></div>

      <div className="relative z-10">
        {/* ================= HERO ================= */}
        <section className="pt-24 sm:pt-28 pb-8 sm:pb-10 text-center px-4 sm:px-6 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-red-600 blur-3xl opacity-20 rounded-full -z-10"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-pink-600 blur-3xl opacity-20 rounded-full -z-10"></div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            Contact Us
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-7 px-2">
            Have questions, suggestions, or need help?
            Our team is always ready to assist you.
          </p>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section className="px-4 sm:px-6 md:px-8 pb-8 sm:pb-10 md:pb-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

            {/* LEFT SIDE - INFO */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-6 md:p-8 rounded-2xl shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-6">
                Get in Touch
              </h2>

              <div className="space-y-5 text-gray-300 text-sm sm:text-base">
                <div>
                  <p className="font-semibold text-white mb-1">📧 Email</p>
                  <a 
                  href="mailto:cs786123@gmail.com"
                  className="break-all">
                    support@bloodstatus.com</a>
                </div>

                <div>
                  <p className="font-semibold text-white mb-1">📞 Phone</p>
                  <a 
                  href="tel:7394827627"
                  className="break-all">
                    +91 7394827627</a>
                </div>

                <div>
                  <p className="font-semibold text-white mb-1">📍 Address</p>
                  <p>Lucknow, Uttar Pradesh, India</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-6 md:p-8 rounded-2xl shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-6">
                Send Message
              </h2>

              <form  onSubmit={handleSubmit}className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e)=> setForm({...form, name:e.target.value})}
                  className="w-full p-3 rounded-lg bg-slate-800/90 border border-slate-600 focus:border-red-500 outline-none text-sm sm:text-base"
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e)=> setForm({...form, email:e.target.value})}
                  className="w-full p-3 rounded-lg bg-slate-800/90 border border-slate-600 focus:border-red-500 outline-none text-sm sm:text-base"
                />

                <textarea
                  rows="4"
                  placeholder="Your Message"
                  value={form.message}
                  onChange={(e)=> setForm({...form, message:e.target.value})}
                  className="w-full p-3 rounded-lg bg-slate-800/90 border border-slate-600 focus:border-red-500 outline-none text-sm sm:text-base resize-none"
                ></textarea>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:scale-[1.02] transition duration-300 py-3 rounded-lg font-semibold shadow-lg text-sm sm:text-base"
                >
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
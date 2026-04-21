import React, { useState } from "react";
import axios from "axios";

export default function AdminLogin() {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const submit = async () => {
    try {
      let url = "";
      let payload = {};

      if (mode === "login") {
        url = "/api/auth/login";
        payload = { email, password };
      }

      if (mode === "signup") {
        url = "/api/auth/signup";
        payload = { name, mobile, age, email, password };
      }

      if (mode === "verify") {
        url = "/api/auth/verify-otp";
        payload = { email, otp };
      }

      if (mode === "forgot") {
        url = "/api/auth/forgot";
        payload = { email };
      }

      const res = await axios.post("http://localhost:5000" + url, payload);

      alert(res.data.msg || "Success");

      if (mode === "login") {
        localStorage.setItem("token", res.data.token);
        window.location.replace("/admin-dashboard");
      }

      if (mode === "signup") setMode("verify");
      if (mode === "verify") setMode("login");
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

  const resendOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/resend-otp", {
        email,
      });
      alert(res.data.msg || "OTP resent");
    } catch (err) {
      alert(err.response?.data?.msg || "Resend failed");
    }
  };

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[2px]" />

      {/* Centered content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center px-4">
        <div className="w-full max-w-[400px] p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-8 tracking-wide">
            {mode === "login" && "Admin Login"}
            {mode === "signup" && "Admin Signup"}
            {mode === "forgot" && "Forgot Password"}
            {mode === "verify" && "Verify OTP"}
          </h2>

          {/* SIGNUP EXTRA FIELDS */}
          {mode === "signup" && (
            <>
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none border border-white/20 focus:border-red-400"
              />

              <input
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none border border-white/20 focus:border-red-400"
              />

              <input
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none border border-white/20 focus:border-red-400"
              />
            </>
          )}

          {/* EMAIL */}
          <input
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none border border-white/20 focus:border-red-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* OTP */}
          {mode === "verify" && (
            <input
              className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none border border-white/20 focus:border-red-400"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          )}

          {/* PASSWORD */}
          {mode !== "forgot" && mode !== "verify" && (
            <input
              type="password"
              className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none border border-white/20 focus:border-red-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          {/* BUTTON */}
          <button
            onClick={submit}
            className="w-full mt-4 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-pink-600 hover:scale-[1.02] hover:shadow-red-500/40 transition-all duration-300 text-white shadow-lg"
          >
            {mode === "login" && "Login"}
            {mode === "signup" && "Create Admin"}
            {mode === "forgot" && "Send Reset Link"}
            {mode === "verify" && "Verify OTP"}
          </button>

          {/* LINKS */}
          <div className="text-center mt-6 text-sm">
            {mode === "login" && (
              <>
                <p
                  className="text-blue-300 hover:text-white cursor-pointer transition"
                  onClick={() => setMode("signup")}
                >
                  Create new admin
                </p>
                <p
                  className="text-blue-300 hover:text-white cursor-pointer mt-2 transition"
                  onClick={() => setMode("forgot")}
                >
                  Forgot password?
                </p>
              </>
            )}

            {mode !== "login" && mode !== "verify" && (
              <p
                className="text-blue-300 hover:text-white cursor-pointer mt-3 transition"
                onClick={() => setMode("login")}
              >
                Back to login
              </p>
            )}

            {mode === "verify" && (
              <>
                <p
                  className="text-blue-300 hover:text-white cursor-pointer transition"
                  onClick={resendOtp}
                >
                  Resend OTP
                </p>

                <p
                  className="text-blue-300 hover:text-white cursor-pointer mt-2 transition"
                  onClick={() => setMode("signup")}
                >
                  Back to signup
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
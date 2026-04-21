import React, { useState } from "react";
import axios from "axios";
import API from "../config";   // ✅ ADD THIS

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

      // ✅ FIXED LINE
      const res = await axios.post(`${API}${url}`, payload);

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
      // ✅ FIXED LINE
      const res = await axios.post(`${API}/api/auth/resend-otp`, {
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
      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[2px]" />

      <div className="relative z-10 h-full w-full flex items-center justify-center px-4">
        <div className="w-full max-w-[400px] p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-8 tracking-wide">
            {mode === "login" && "Admin Login"}
            {mode === "signup" && "Admin Signup"}
            {mode === "forgot" && "Forgot Password"}
            {mode === "verify" && "Verify OTP"}
          </h2>

          {mode === "signup" && (
            <>
              <input placeholder="Full Name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="input" />

              <input placeholder="Mobile Number" value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="input" />

              <input placeholder="Age" value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input" />
            </>
          )}

          <input className="input" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} />

          {mode === "verify" && (
            <input className="input" placeholder="Enter OTP"
              value={otp} onChange={(e) => setOtp(e.target.value)} />
          )}

          {mode !== "forgot" && mode !== "verify" && (
            <input type="password" className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
          )}

          <button onClick={submit} className="btn">
            {mode === "login" && "Login"}
            {mode === "signup" && "Create Admin"}
            {mode === "forgot" && "Send Reset Link"}
            {mode === "verify" && "Verify OTP"}
          </button>

          <div className="text-center mt-6 text-sm">
            {mode === "login" && (
              <>
                <p onClick={() => setMode("signup")}>Create new admin</p>
                <p onClick={() => setMode("forgot")}>Forgot password?</p>
              </>
            )}

            {mode !== "login" && mode !== "verify" && (
              <p onClick={() => setMode("login")}>Back to login</p>
            )}

            {mode === "verify" && (
              <>
                <p onClick={resendOtp}>Resend OTP</p>
                <p onClick={() => setMode("signup")}>Back to signup</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import React from "react";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserMap from "./pages/UserMap";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Hospitals from "./pages/Hospitals";
import Footer from "./components/Footer";

export default function App() {
  const isAdmin = !!localStorage.getItem("token");
  const location = useLocation();

  // Home aur Admin page pe footer hide rahega
  const hideFooter =
  location.pathname === "/" ||
  location.pathname === "/admin" ||
  location.pathname === "/admin-dashboard";
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<UserMap />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/hospitals" element={<Hospitals />} />

          <Route
            path="/admin-dashboard"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin" />}
          />
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}
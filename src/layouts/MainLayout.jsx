import React from "react";
import { Link, Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        <Outlet /> 
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;

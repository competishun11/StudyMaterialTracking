import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import DashboardNav from "../components/Dashboard/DashboardNav";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <DashboardNav />

      {/* Main Content */}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;

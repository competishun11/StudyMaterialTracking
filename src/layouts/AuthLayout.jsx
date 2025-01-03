import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
        {/* Outlet for Authentication Pages */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

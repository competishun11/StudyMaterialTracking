import React from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();

  return (
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
  );
};

export default Dashboard;

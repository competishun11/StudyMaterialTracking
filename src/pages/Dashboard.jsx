import React from "react";
import { useAuth } from "../context/AuthContext";
import { PaginationProvider } from "../context/PaginationContext";
import { DataProvider } from "../context/DataContext";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <PaginationProvider>
      <DataProvider>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </DataProvider>
    </PaginationProvider>
  );
};

export default Dashboard;

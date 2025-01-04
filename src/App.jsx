import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // Import the Dashboard component
import NotFound from "./pages/NotFound";
import AuthProvider from "./context/AuthContext";
import FirebaseProvider from "./context/FirebaseContext";
import ProtectedRoute from "./router/PrivateRoute";
import UploadExcel from "./components/Dashboard/UploadExcel";
import UploadForm from "./components/Dashboard/UploadForm";
import DashboardHome from "./components/Dashboard/DashboardHome";
// import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

const App = () => {
  return (
    <FirebaseProvider>
      <AuthProvider>
        {/* <Router basename="/StudyMaterialTracking"> */}
        <Router >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/auth" element={<MainLayout />}>
              <Route path="login" element={<Login />} />
            </Route>

            {/* Protected Route for Dashboard */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="uploadExcel" element={<UploadExcel />} />
              <Route path="uploadForm" element={<UploadForm />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </FirebaseProvider>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDetails from "./pages/StudentDetails";
import NotFound from "./pages/NotFound";
import AuthProvider from "./context/AuthContext";
import FirebaseProvider from "./context/FirebaseContext";

const App = () => {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
            </Route>

            {/* Protected Routes */}
            <Route path="/student" element={<MainLayout />}>
              <Route path="details" element={<StudentDetails />} />
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

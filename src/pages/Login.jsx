import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFirebase } from "../context/FirebaseContext";
import {    signInWithGoogle } from "../firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const Login = () => {
  const navigate = useNavigate();
  const { login,logout } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/dashboard";

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      if (user) {
        console.log(user);
        // Check if user exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // First-time login, create a new user document with all details
          await setDoc(userRef, {
            uid: user.uid,
            type: "user", // Default type is 'user'
            name: user.displayName,
            email: user.email,
            firstLoginTime: new Date(),
            lastLoginTime: new Date(),
            ...user.providerData[0], // Capture other provider data (e.g., photo URL, etc.)
          });

          console.log("User signed in for the first time, details saved.");
        } else {
          // User exists, update the last login time
          await updateDoc(userRef, {
            lastLoginTime: new Date(),
          });

          console.log("User logged in again, last login time updated.");
        }

        // Check user type (only allow admin to log in)
        const userData = userDoc.data();
        if (userData.type !== "admin") {
          // Show alert and log out if the user is not an admin
          await logout(); // Log out the user immediately
          alert("You do not have admin access to log in.");
          console.log("Non-admin user logged out.");
          return; // Exit the function after logging out
        }

        console.log("Admin login successful.");

        login(user);
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      alert("Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Login with Google
        </h2>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
          disabled={loading}
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Sign in with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;

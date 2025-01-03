import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useFirebase } from "../context/FirebaseContext";

const Login = () => {
  const navigate = useNavigate();
  const { auth } = useFirebase();
  const { login } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/dashboard";
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      login(user); 
      navigate(from, { replace: true }); // Redirect to dashboard
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

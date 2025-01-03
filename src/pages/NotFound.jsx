import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-center">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-red-600 mb-4">
          404 - Page Not Found
        </h2>
        <p className="text-lg mb-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="text-blue-600 hover:underline text-lg">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

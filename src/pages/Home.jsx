import React, { useState } from "react";
import Navbar from "../components/Navbar";
import LoginForm from "../components/Form/LoginForm";

const Home = () => {
  const [message, setMessage] = useState("");

  const handleFormSubmit = (mobileNumber) => {
    setMessage("Fetching details...");
    setTimeout(() => {
      setMessage(`Details for mobile number: ${mobileNumber}`);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center p-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          Physical Study Material Tracking Information 2025-26
        </h1>
        <LoginForm onSubmit={handleFormSubmit} />
        <div id="message" className="text-center mt-4 text-lg">
          {message}
        </div>
        <div
          id="warning"
          className="bg-yellow-100 border-l-4 border-yellow-500 rounded p-4 mt-6 max-w-2xl shadow-md"
        >
          <p>
            <strong className="text-yellow-800">Please Note:</strong>
          </p>
          <ul className="list-disc pl-4 text-gray-800 space-y-2">
            <li>
              Tracking Id provided will be activated at India Post Website
              within 2-3 Working Days.
            </li>
            <li>
              Your material will be delivered within 10-12 working days after
              filling out the Google Form.
            </li>
            <li>
              Do not pay any amount to the delivery person for this material. If
              you have any such experience, call us at{" "}
              <strong>74108-33331 (Vijay Sir)</strong>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;

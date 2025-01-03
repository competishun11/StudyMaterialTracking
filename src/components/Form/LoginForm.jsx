import React, { useState } from "react";

const LoginForm = ({ onSubmit }) => {
  const [mobileNumber, setMobileNumber] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(mobileNumber);
  };

  return (
    <form
      id="loginForm"
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4 mt-10"
    >
      <label htmlFor="mobileNumber" className="text-lg font-medium">
        Enter Mobile Number:
      </label>
      <input
        type="number"
        id="mobileNumber"
        name="mobileNumber"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        required
        className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default LoginForm;


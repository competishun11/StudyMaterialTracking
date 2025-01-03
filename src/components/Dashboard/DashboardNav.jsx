import React, { useContext } from "react";
import logo from "../../asset/logo.png";
import { useFirebase } from "../../context"; 
import { logout } from "../../firebase/auth";

const DashboardNav = () => {
  const { auth } = useFirebase();
  const userEmail = auth?.currentUser?.email || "User Email";

  const handleLogout = () => {
    logout()
      .then(() => {
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Logout failed: ", error);
      });
  };

  return (
    <div className="bg-blue-500 flex justify-around items-center p-4">
      <a href="/">
        <img src={logo} alt="Logo" className="h-12" />
      </a>
      <div className="flex items-center gap-4">
        <span className="text-white">{userEmail}</span>
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardNav;

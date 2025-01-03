import React from "react";
import logo from "../asset/logo.png"

const Navbar = () => {
  return (
    <div className="bg-blue-500 flex justify-around items-center p-4">
      <a href="#">
        <img src={logo} alt="Logo" className="h-12" />
      </a>
      <a
        href="#"
        className="text-white hover:bg-gray-200 hover:text-black px-4 py-2 rounded"
      >
        Support
      </a>
    </div>
  );
};

export default Navbar;

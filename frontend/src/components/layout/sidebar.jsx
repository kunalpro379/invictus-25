import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed flex flex-col justify-between">
      <div>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Invictus</h1>
        </div>
        <nav className="mt-10">
          <NavLink
            to="/research-papers"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            activeClassName="bg-gray-700"
          >
            Research Papers
          </NavLink>
          <NavLink
            to="/datasets"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            activeClassName="bg-gray-700"
          >
            Datasets
          </NavLink>
          <NavLink
            to="/articles"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            activeClassName="bg-gray-700"
          >
            Articles
          </NavLink>
          <NavLink
            to="/profile"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            activeClassName="bg-gray-700"
          >
            Profile
          </NavLink>
        </nav>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 rounded transition duration-200 bg-red-500 hover:bg-red-600 text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
// components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Clear user data on logout
      navigate("/login");
    }
  };

  return (
    <div className="w-64 h-screen bg-white text-gray-800 shadow-lg fixed flex flex-col justify-between border-r border-gray-200">
      <div>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-black">ReSync</h1>
          {user && (
            <p className="text-sm text-gray-600 mt-2">
              Hi, {user.firstName} {user.lastName}
            </p>
          )}
        </div>
        <nav className="mt-4">
          <NavLink
            to="/research-papers"
            className={({ isActive }) =>
              `block py-2.5 px-4 rounded transition duration-200 ${
                isActive ? "bg-black/30 text-blue-600 text-gray-700" : "hover:bg-black/10 text-black"
              }`
            }
          >
            Research Papers
          </NavLink>
          <NavLink
            to="/datasets"
            className={({ isActive }) =>
              `block py-2.5 px-4 rounded transition duration-200 ${
                isActive ? "bg-black/30 text-blue-600 text-gray-700" : "hover:bg-black/10 text-black"
              }`
            }
          >
            Datasets
          </NavLink>
          {/* <NavLink
            to="/articles"
            className={({ isActive }) =>
              `block py-2.5 px-4 rounded transition duration-200 ${
                isActive ? "bg-black/30 text-blue-600 text-gray-700" : "hover:bg-black/10 text-black"
              }`
            }
          >
            Articles
          </NavLink> */}
          <NavLink
            to="/connections"
            className={({ isActive }) =>
              `block py-2.5 px-4 rounded transition duration-200 ${
                isActive ? "bg-black/30 text-blue-600 text-gray-700" : "hover:bg-black/10 text-black"
              }`
            }
          >
            Connect
          </NavLink>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `block py-2.5 px-4 rounded transition duration-200 ${
                isActive ? "bg-black/30 text-blue-600 text-gray-700" : "hover:bg-black/10 text-black"
              }`
            }
          >
            Messages
          </NavLink>
          <NavLink
            to="/news"
            className={({ isActive }) =>
              `block py-2.5 px-4 rounded transition duration-200 ${
                isActive ? "bg-black/30 text-blue-600 text-gray-700" : "hover:bg-black/10 text-black"
              }`
            }
          >
            News
          </NavLink>
          <NavLink
            to="/update-profile"
            className={({ isActive }) =>
              `block py-2.5 px-4 rounded transition duration-200 ${
                isActive ? "bg-black/30 text-blue-600 text-gray-700" : "hover:bg-black/10 text-black"
              }`
            }
          >
            Profile
          </NavLink>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
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
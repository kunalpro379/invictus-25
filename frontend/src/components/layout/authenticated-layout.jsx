import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
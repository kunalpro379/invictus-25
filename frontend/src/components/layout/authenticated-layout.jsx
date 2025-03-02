// components/layout/authenticated-layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isAuthenticated = !!localStorage.getItem("token");

  const fetchUserData = async (token) => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (err) {
      console.error("Error fetching user data:", err.response?.data || err.message);
      return null;
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (token) {
        const fetchedUser = await fetchUserData(token);
        if (fetchedUser) {
          setUser(fetchedUser);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
        }
      }
    };

    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex">
      <Sidebar user={user} />
      <main className="flex-1 ml-64 p-6 min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
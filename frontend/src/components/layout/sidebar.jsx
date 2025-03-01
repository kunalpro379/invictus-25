import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Database, FileText, User } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { path: "/research-papers", icon: BookOpen, label: "Research Papers" },
    { path: "/datasets", icon: Database, label: "Datasets" },
    { path: "/articles", icon: FileText, label: "Articles" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">ResearchSync</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 ${
                  isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="absolute bottom-6 left-6">
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="w-full bg-red-50 text-red-600 hover:bg-red-100"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const Messages = () => {
  const { userId } = useParams(); // Get the target user ID from URL
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:3000/api/network";

  const fetchUserById = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTargetUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load user data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUserById();
    }
  }, [token, userId, navigate]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleBack = () => {
    navigate("/connections");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !targetUser) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error || "User not found."}</p>
        <Button onClick={handleBack} className="mt-4">Back to Connections</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Messages with {targetUser.firstName} {targetUser.lastName}
        </h1>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-200"
          onClick={handleBack}
        >
          <span>←</span> Back to Connections
        </Button>
      </div>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex items-center gap-4 border-b border-gray-200">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage src={targetUser.profileImage} alt={`${targetUser.firstName} ${targetUser.lastName}`} />
            <AvatarFallback className="bg-blue-600 text-white">
              {getInitials(targetUser.firstName, targetUser.lastName)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {targetUser.firstName} {targetUser.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-gray-600">Chat functionality coming soon!</p>
          {/* Placeholder for future chat implementation */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;
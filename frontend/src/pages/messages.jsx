// pages/messages.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const Messages = () => {
  const { state } = useLocation();
  const { currentUser } = state || {};

  if (!currentUser) {
    return <div className="container mx-auto p-4">No user data available. Please go back to Connections.</div>;
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      {/* Current User Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current User</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={currentUser.profileImage} alt={`${currentUser.firstName} ${currentUser.lastName}`} />
            <AvatarFallback>{getInitials(currentUser.firstName, currentUser.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <p><strong>Name:</strong> {currentUser.firstName} {currentUser.lastName}</p>
            <p><strong>Institute:</strong> {currentUser.instituteName}</p>
            <p><strong>Interests:</strong> {currentUser.interests}</p>
          </div>
        </CardContent>
      </Card>

      {/* Connected Users */}
      <h2 className="text-2xl font-semibold mb-4">Connected Users</h2>
      {currentUser.connections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUser.connections.map((connectedUser) => (
            <Card key={connectedUser._id}>
              <CardHeader>
                <CardTitle>{connectedUser.firstName} {connectedUser.lastName}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={connectedUser.profileImage} alt={`${connectedUser.firstName} ${connectedUser.lastName}`} />
                  <AvatarFallback>{getInitials(connectedUser.firstName, connectedUser.lastName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p><strong>Institute:</strong> {connectedUser.instituteName}</p>
                  <p><strong>Interests:</strong> {connectedUser.interests}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No connections yet.</p>
      )}
    </div>
  );
};

export default Messages;
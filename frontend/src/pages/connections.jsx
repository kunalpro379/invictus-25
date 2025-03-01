import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Connections = () => {
  // State for browsing users
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, limit: 10, skip: 0, hasMore: false });
  const [sortBy, setSortBy] = useState("firstName");
  const [sortOrder, setSortOrder] = useState(1);

  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [interests, setInterests] = useState("");

  // State for selected user profile
  const [selectedUser, setSelectedUser] = useState(null);

  // API base URL and token (replace with your actual setup)
  const API_BASE_URL = "http://localhost:3000/api/network"; // Updated to include /api/network
  const token = "YOUR_AUTH_TOKEN_HERE"; // Replace with real token

  // Fetch all users with pagination and sorting
  const fetchUsers = async (reset = false) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: meta.limit,
          skip: reset ? 0 : meta.skip,
          sortBy,
          sortOrder,
        },
      });
      const { users: fetchedUsers, meta: fetchedMeta } = response.data;
      setUsers(reset ? fetchedUsers : [...users, ...fetchedUsers]);
      setMeta(fetchedMeta);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Search users with filters
  const searchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          query: searchQuery || undefined,
          instituteName: instituteName || undefined,
          interests: interests || undefined,
          limit: meta.limit,
          skip: 0,
        },
      });
      const { users: fetchedUsers, meta: fetchedMeta } = response.data;
      setUsers(fetchedUsers);
      setMeta(fetchedMeta);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Fetch a single user by ID
  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
    }
  };

  // Load initial users on mount or when sorting changes
  useEffect(() => {
    fetchUsers(true);
  }, [sortBy, sortOrder]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    searchUsers();
  };

  // Load more users (pagination)
  const loadMore = () => {
    fetchUsers();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Networking</h1>

      {/* Search and Filter Form */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by name or bio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Filter by institute..."
          value={instituteName}
          onChange={(e) => setInstituteName(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Filter by interests..."
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Search</Button>
      </form>

      {/* Sorting Options */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firstName">First Name</SelectItem>
              <SelectItem value="lastName">Last Name</SelectItem>
              <SelectItem value="instituteName">Institute Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Order:</span>
          <Select value={sortOrder.toString()} onValueChange={(val) => setSortOrder(Number(val))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Ascending</SelectItem>
              <SelectItem value="-1">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user._id}>
            <CardHeader>
              <CardTitle>
                {user.firstName} {user.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Institute:</strong> {user.instituteName}
              </p>
              <p>
                <strong>Interests:</strong> {user.interests}
              </p>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => fetchUserById(user._id)}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {meta.hasMore && (
        <Button onClick={loadMore} className="mt-6 w-full sm:w-auto mx-auto block">
          Load More
        </Button>
      )}

      {/* Selected User Profile (Modal-like) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {selectedUser.firstName} {selectedUser.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Bio:</strong> {selectedUser.shortBio}
              </p>
              <p>
                <strong>Institute:</strong> {selectedUser.instituteName}
              </p>
              <p>
                <strong>Interests:</strong> {selectedUser.interests}
              </p>
              {selectedUser.papers.length > 0 && (
                <div>
                  <strong>Papers:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    {selectedUser.papers.map((paper, index) => (
                      <li key={index}>
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {paper.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button
                variant="destructive"
                className="mt-4 w-full"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Connections;
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import {
    User,
    University,
    BookOpen,
    FileText,
    Calendar,
    ExternalLink,
    Bookmark,
} from "lucide-react";

const Connections = () => {
    // State for browsing users
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({
        total: 0,
        limit: 10,
        skip: 0,
        hasMore: false,
    });
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
    const token = localStorage.getItem("token");

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
            const response = await axios.get(
                `${API_BASE_URL}/users/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
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

    // Get initials for Avatar fallback
    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    // Get the number of publications
    const getPublicationsCount = (papers) => {
        return papers?.length || 0;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Networking</h1>

            {/* Search and Filter Form */}
            <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-4 mb-6"
            >
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
                            <SelectItem value="firstName">
                                First Name
                            </SelectItem>
                            <SelectItem value="lastName">Last Name</SelectItem>
                            <SelectItem value="instituteName">
                                Institute Name
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Order:</span>
                    <Select
                        value={sortOrder.toString()}
                        onValueChange={(val) => setSortOrder(Number(val))}
                    >
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
                    <Card
                        key={user._id}
                        className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 pb-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                    <AvatarImage
                                        src={user.profileImage}
                                        alt={`${user.firstName} ${user.lastName}`}
                                    />
                                    <AvatarFallback className="bg-blue-600 text-white">
                                        {getInitials(
                                            user.firstName,
                                            user.lastName
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg font-bold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </CardTitle>
                                    <div className="text-sm text-blue-600 font-medium flex items-center mt-1">
                                        <University className="h-3 w-3 mr-1" />
                                        {user.instituteName}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {/* Publications Count */}
                            <div className="flex items-center mb-3 text-sm font-medium text-gray-700">
                                <FileText className="h-4 w-4 mr-1.5 text-blue-600" />
                                <span>
                                    {getPublicationsCount(user.papers)}{" "}
                                    publications
                                </span>
                            </div>

                            {/* Interest Chips */}
                            <div className="mb-2">
                                <h4 className="text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                                    <BookOpen className="h-4 w-4 mr-1.5 text-blue-600" />
                                    Research Interests
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {user.interests
                                        ?.split(",")
                                        .slice(0, 3)
                                        .map((interest, idx) => (
                                            <Badge
                                                key={idx}
                                                className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 text-xs px-2 py-0.5 rounded-full"
                                            >
                                                {interest.trim()}
                                            </Badge>
                                        ))}
                                    {user.interests?.split(",").length > 3 && (
                                        <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 text-xs px-2 py-0.5 rounded-full">
                                            +
                                            {user.interests.split(",").length -
                                                3}{" "}
                                            more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 border-t border-gray-200 p-3 flex justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100"
                                onClick={() => fetchUserById(user._id)}
                            >
                                View Profile
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Load More Button */}
            {meta.hasMore && (
                <Button
                    onClick={loadMore}
                    className="mt-6 w-full sm:w-auto mx-auto block"
                >
                    Load More
                </Button>
            )}

            {/* Selected User Profile Modal using Dialog component */}
            <Dialog
                open={!!selectedUser}
                onOpenChange={(open) => !open && setSelectedUser(null)}
            >
                {selectedUser && (
                    <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 p-0 overflow-hidden rounded-lg border border-gray-200">
                        {/* Header with gradient background */}
                        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                                    <AvatarImage
                                        src={selectedUser.profileImage}
                                        alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                    />
                                    <AvatarFallback className="text-lg bg-blue-600 text-white">
                                        {getInitials(
                                            selectedUser.firstName,
                                            selectedUser.lastName
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-gray-900">
                                        {selectedUser.firstName}{" "}
                                        {selectedUser.lastName}
                                    </DialogTitle>
                                    <DialogDescription className="text-base text-blue-600 font-medium mt-1 flex items-center">
                                        <University className="h-4 w-4 mr-1.5" />
                                        {selectedUser.instituteName}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <ScrollArea className="max-h-[65vh] px-6 py-4">
                            <div className="space-y-5">
                                {/* Bio Section */}
                                {selectedUser.shortBio && (
                                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                                            <User className="h-4 w-4 mr-2 text-blue-600" />
                                            About
                                        </h3>
                                        <p className="text-gray-600">
                                            {selectedUser.shortBio}
                                        </p>
                                    </div>
                                )}

                                {/* Research Interests */}
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                                        Research Interests
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.interests
                                            .split(",")
                                            .map((interest, idx) => (
                                                <Badge
                                                    key={idx}
                                                    className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 text-sm px-3 py-1 rounded-full"
                                                >
                                                    {interest.trim()}
                                                </Badge>
                                            ))}
                                    </div>
                                </div>

                                {/* Publications */}
                                {selectedUser.papers &&
                                    selectedUser.papers.length > 0 && (
                                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                                                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                                Publications
                                            </h3>
                                            <ul className="space-y-2">
                                                {selectedUser.papers.map(
                                                    (paper, index) => (
                                                        <li
                                                            key={index}
                                                            className="py-2 px-3 bg-blue-50 rounded-md flex items-center"
                                                        >
                                                            <span className="h-5 w-5 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-2 text-xs font-medium">
                                                                {index + 1}
                                                            </span>
                                                            <a
                                                                href={paper.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline text-sm font-medium flex-1"
                                                            >
                                                                {paper.name}
                                                            </a>
                                                            <ExternalLink className="h-3.5 w-3.5 text-blue-400 ml-1 flex-shrink-0" />
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                {/* Additional Info */}
                                {selectedUser.contactEmail && (
                                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                                            Contact Information
                                        </h3>
                                        <div className="text-sm text-gray-600">
                                            <p className="mb-1">
                                                <strong>Email:</strong>{" "}
                                                {selectedUser.contactEmail}
                                            </p>
                                            {selectedUser.phoneNumber && (
                                                <p className="mb-1">
                                                    <strong>Phone:</strong>{" "}
                                                    {selectedUser.phoneNumber}
                                                </p>
                                            )}
                                            {selectedUser.website && (
                                                <p className="mb-1">
                                                    <strong>Website:</strong>{" "}
                                                    <a
                                                        href={
                                                            selectedUser.website
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {selectedUser.website}
                                                    </a>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Active Since */}
                                {selectedUser.createdAt && (
                                    <div className="mt-4 text-sm text-gray-500 flex items-center justify-end">
                                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                        Active since:{" "}
                                        {new Date(
                                            selectedUser.createdAt
                                        ).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex sm:justify-between gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedUser(null)}
                                className="border-gray-300 text-gray-700"
                            >
                                Close
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                >
                                    Message
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Connect
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
};

export default Connections;

// services/networking.service.js
const { User } = require("../schemas/users.schema");

/**
 * Get all users for networking purposes
 * Excludes sensitive data like email and password
 * @param {Object} options - Optional filtering parameters
 * @returns {Object} - Result with users data or error
 */
const getAllUsers = async (options = {}) => {
    try {
        const {
            limit = 50,
            skip = 0,
            sortBy = "firstName",
            sortOrder = 1,
        } = options;

        // Build sorting object
        const sort = {};
        sort[sortBy] = sortOrder;

        // Find all users but exclude sensitive information
        const users = await User.find({})
            .select("-password -username") // Exclude password and email (username)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalCount = await User.countDocuments({});

        return {
            success: true,
            status: 200,
            users,
            meta: {
                total: totalCount,
                limit,
                skip,
                hasMore: skip + users.length < totalCount,
            },
        };
    } catch (error) {
        console.error("Get All Users Error:", error);
        return {
            success: false,
            status: 500,
            message: "Error fetching users",
        };
    }
};

/**
 * Search users based on provided criteria
 * @param {Object} searchParams - Search parameters
 * @returns {Object} - Result with matching users or error
 */
const searchUsers = async (searchParams = {}) => {
    try {
        const {
            query,
            instituteName,
            interests,
            limit = 50,
            skip = 0,
        } = searchParams;

        // Build search query
        const searchQuery = {};

        // Add text search if provided
        if (query) {
            searchQuery.$or = [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { shortBio: { $regex: query, $options: "i" } },
            ];
        }

        // Add institution filter if provided
        if (instituteName) {
            searchQuery.instituteName = {
                $regex: instituteName,
                $options: "i",
            };
        }

        // Add interests filter if provided
        if (interests) {
            searchQuery.interests = { $regex: interests, $options: "i" };
        }

        // Find matching users but exclude sensitive information
        const users = await User.find(searchQuery)
            .select("-password -username") // Exclude password and email
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalCount = await User.countDocuments(searchQuery);

        return {
            success: true,
            status: 200,
            users,
            meta: {
                total: totalCount,
                limit,
                skip,
                hasMore: skip + users.length < totalCount,
            },
        };
    } catch (error) {
        console.error("Search Users Error:", error);
        return {
            success: false,
            status: 500,
            message: "Error searching users",
        };
    }
};

/**
 * Get single user profile by ID for networking
 * @param {string} userId - User ID to fetch
 * @returns {Object} - Result with user data or error
 */
const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId).select("-password -username"); // Exclude password and email

        if (!user) {
            return {
                success: false,
                status: 404,
                message: "User not found",
            };
        }

        return {
            success: true,
            status: 200,
            user,
        };
    } catch (error) {
        console.error("Get User By ID Error:", error);
        return {
            success: false,
            status: 500,
            message: "Error fetching user",
        };
    }
};

module.exports = {
    getAllUsers,
    searchUsers,
    getUserById,
};

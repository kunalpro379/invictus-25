// routes/networking.routes.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware");
const networkingService = require("../services/networking.service");
const zod = require("zod");

// Validation schemas
const paginationSchema = zod.object({
    limit: zod.string().regex(/^\d+$/).transform(Number).optional(),
    skip: zod.string().regex(/^\d+$/).transform(Number).optional(),
    sortBy: zod.enum(["firstName", "lastName", "instituteName"]).optional(),
    sortOrder: zod.enum(["1", "-1"]).transform(Number).optional(),
});

const searchSchema = zod.object({
    query: zod.string().optional(),
    instituteName: zod.string().optional(),
    interests: zod.string().optional(),
    limit: zod.string().regex(/^\d+$/).transform(Number).optional(),
    skip: zod.string().regex(/^\d+$/).transform(Number).optional(),
});

router.post("/connect/:userId", authMiddleware, async (req, res) => {
    try {
        const currentUserId = req.user._id || req.user.id;
        const targetUserId = req.params.userId;

        if (!currentUserId || !targetUserId) {
            return res.status(400).json({ message: "User IDs are required" });
        }

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "Cannot connect to yourself" });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!currentUser.connections.includes(targetUserId)) {
            currentUser.connections.push(targetUserId);
            await currentUser.save();
        }

        return res.status(200).json({
            success: true,
            message: "Connection added successfully",
            connections: currentUser.connections,
        });
    } catch (error) {
        console.error("Connect User Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get user connections
router.get("/connections", authMiddleware, async (req, res) => {
    try {
        const currentUserId = req.user._id || req.user.id;
        const user = await User.findById(currentUserId).populate("connections", "-password -username");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            connections: user.connections,
        });
    } catch (error) {
        console.error("Fetch Connections Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all users with pagination
router.get("/users", authMiddleware, async (req, res) => {
    try {
        const validation = paginationSchema.safeParse(req.query);
        if (!validation.success) {
            return res.status(400).json({
                message: "Invalid query parameters",
                errors: validation.error.errors,
            });
        }

        const result = await networkingService.getAllUsers(validation.data);
        return res
            .status(result.status)
            .json(
                result.success
                    ? { users: result.users, meta: result.meta }
                    : { message: result.message }
            );
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Search users
router.get("/search", authMiddleware, async (req, res) => {
    try {
        const validation = searchSchema.safeParse(req.query);
        if (!validation.success) {
            return res.status(400).json({
                message: "Invalid search parameters",
                errors: validation.error.errors,
            });
        }

        const result = await networkingService.searchUsers(validation.data);
        return res
            .status(result.status)
            .json(
                result.success
                    ? { users: result.users, meta: result.meta }
                    : { message: result.message }
            );
    } catch (error) {
        console.error("Search Users Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get single user profile by ID
router.get("/users/:userId", authMiddleware, async (req, res) => {
    try {
        const result = await networkingService.getUserById(req.params.userId);
        return res
            .status(result.status)
            .json(
                result.success
                    ? { user: result.user }
                    : { message: result.message }
            );
    } catch (error) {
        console.error("Get User By ID Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

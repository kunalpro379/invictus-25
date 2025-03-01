const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../schemas/users.schema");
const bcrypt = require("bcryptjs");
const { authMiddleware } = require("../middleware");
const { generateToken } = require("../config");

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6),
    shortBio: zod.string().max(2000),
    interests: zod.string(),
    instituteName: zod.string(),
    papers: zod.array(
        zod.object({
            name: zod.string(),
            url: zod.string().url(),
        })
    ),
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string().optional(),
  password: zod.string().min(6)
});

router.post("/signup", async (req, res) => {
    try {
        const validation = signupBody.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const {
            username,
            firstName,
            lastName,
            password,
            shortBio,
            interests,
            instituteName,
            papers,
        } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Email already taken" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            firstName,
            lastName,
            password: hashedPassword,
            shortBio,
            interests,
            instituteName,
            papers,
        });

        await newUser.save();

        const token = generateToken(newUser);
        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
});

router.post("/signin", async (req, res) => {
    try {
        const validation = signinBody.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const token = generateToken(user);
        res.json({ message: "User logged in successfully!", token });
    } catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports = router;


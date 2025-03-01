const path = require('path');
require("dotenv").config({
      path: path.resolve(__dirname, "../.env")
});
const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../schemas/users.schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const { Transaction } = require("../schemas/transaction.schema");

const JWT_SECRET = process.env.JWT_SECRET;

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(6),
});

router.post("/signup", async (req, res) => {
    try {
        const { username, firstName, lastName, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Email already taken" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            firstName,
            lastName,
            password: hashedPassword
        });

        await newUser.save();
        const newAccount = new Account({
            user: newUser._id,
            balance: 1000 
        });

        await newAccount.save();
        newUser.account = newAccount._id;
        await newUser.save();  

        res.status(201).json({ message: "User created successfully", user: newUser });
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
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "User logged in successfully!", token: token });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const updatedBody = zod.object({
  password: zod.string().min(6).optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    const validation = updatedBody.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid update data" });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({ message: "Updated successfully!" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/bulk", async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
    });

    res.json({
      users: users.map((user) => ({
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      })),
    });
  } catch (error) {
    console.error("Bulk Fetch Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:userId/balance", async (req, res) => {
    try {
        const account = await Account.findOne({ user: req.params.userId });
        if (!account) return res.status(404).json({ message: "Account not found" });

        res.json({ balance: account.balance });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/:userId/deposit", async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }

    const account = await Account.findOneAndUpdate(
        { user: req.params.userId },
        { $inc: { balance: amount } },
        { new: true }
    );

    if (!account) return res.status(404).json({ message: "Account not found" });

    const transaction = new Transaction({
        account: account._id,
        type: "Deposit",
        amount
    });

    await transaction.save();

    res.json({ message: "Deposit successful", balance: account.balance });
});

// ✅ Withdraw Money
router.post("/:userId/withdraw", async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }

    const account = await Account.findOneAndUpdate(
        { user: req.params.userId, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { new: true }
    );

    if (!account) return res.status(400).json({ message: "Insufficient funds or account not found" });

    const transaction = new Transaction({
        account: account._id,
        type: "Withdraw",
        amount
    });

    await transaction.save();

    res.json({ message: "Withdrawal successful", balance: account.balance });
});

module.exports = router;

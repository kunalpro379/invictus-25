const express = require('express');
const router = express.Router();
const {Account} = require('../schemas/account.schema');
const {authMiddleware} = require('../middleware');
const mongoose = require('mongoose');

router.get('/balance', authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        user: req.userId  // Corrected to match the schema
    });
    if (!account) {
        return res.status(404).json({
            message: "Account not found for this user"
        });
    }
    res.json({
        balance: account.balance
    });
});

router.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const account = await Account.findOne({ user: req.userId }).session(session); // Corrected
        const { amount, to } = req.body;

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ user: to }).session(session); // Corrected

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid Account"
            });
        }

        await Account.updateOne({ user: req.userId }, { $inc: { balance: -amount } }).session(session); // Corrected
        await Account.updateOne({ user: to }, { $inc: { balance: amount } }).session(session); // Corrected
        await session.commitTransaction();
        res.json({
            message: "Transfer Successful"
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Transfer failed" });
    } finally {
        session.endSession();
    }
});

module.exports = router;
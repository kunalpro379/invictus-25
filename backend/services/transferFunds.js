require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});
const mongoose = require('mongoose');
const { Account } = require("../schemas/account.schema");

const transferFunds = async (fromAccountId, toAccountId, amount) => {
    const session = await mongoose.startSession();  // ✅ Start a session for transactions
    session.startTransaction();

    try {
        // Step 1: Deduct balance from sender
        const sender = await Account.findByIdAndUpdate(
            fromAccountId,
            { $inc: { balance: -amount } },
            { session, new: true }
        );

        if (!sender || sender.balance < 0) {
            throw new Error("Insufficient balance or sender not found");
        }

        // Step 2: Add balance to receiver
        const receiver = await Account.findByIdAndUpdate(
            toAccountId,
            { $inc: { balance: amount } },
            { session, new: true }
        );

        if (!receiver) {
            throw new Error("Receiver account not found");
        }

        // Step 3: Commit transaction (Both updates succeed)
        await session.commitTransaction();
        session.endSession();
        return { success: true, message: "Transfer successful" };

    } catch (error) {
        // Step 4: Rollback transaction on error
        await session.abortTransaction();
        session.endSession();
        return { success: false, message: error.message };
    }
}

module.exports = { transferFunds };
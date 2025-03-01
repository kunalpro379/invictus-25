require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});
const mongoose = require('mongoose');
const { Account } = require('../schemas/account.schema');
const { Transaction } = require('../schemas/transaction.schema');

const transferFunds = async (fromAccountId, toAccountId, amount) => {
  const session = await mongoose.startSession();
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

      // Step 3: Log transaction
      const transaction = new Transaction({
          account: fromAccountId,
          type: "Transfer",
          amount,
          sender: fromAccountId,
          receiver: toAccountId
      });

      await transaction.save({ session });

      // Step 4: Commit transaction
      await session.commitTransaction();
      session.endSession();

      return { success: true, message: "Transfer successful" };

  } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: error.message };
  }
};

module.exports = { transferFunds };

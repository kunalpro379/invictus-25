const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },  // ✅ Account linked
    type: { type: String, enum: ['Deposit', 'Withdraw', 'Transfer'], required: true },  // ✅ Type of transaction
    amount: { type: Number, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },  // ✅ Optional sender for transfers
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },  // ✅ Optional receiver for transfers
    timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = { Transaction };

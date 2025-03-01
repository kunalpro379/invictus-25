const mongoose = require("mongoose");

const accountSchema = new mongoose.mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // ✅ Ensure User ID is linked
    balance: { type: Number, required: true, default: 1000 },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    createdAt: { type: Date, default: Date.now }
})
const Account = mongoose.model("Account", accountSchema);

module.exports = {Account};
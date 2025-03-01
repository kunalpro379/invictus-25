require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,  
        });
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err);
        process.exit(1);  
    }
};
connectDB();  

mongoose.set("debug", true);  // Enable query logging

const { User } = require('./schemas/users.schema');
const { Account } = require('./schemas/account.schema');

module.exports = {
    User, Account
};

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String, 
        required: true,
        minLength: 6,
        maxLength: 100  
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30,
    },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };

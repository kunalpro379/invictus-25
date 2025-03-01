const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const rootRouter = require('./routes/index');

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    console.error("❌ Missing env vars");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use('/api/v1', rootRouter);
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

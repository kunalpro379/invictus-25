// JWT -> Header, Payload, Signature
// Signing:
// (Header+Payload) + (Secret) => JWT ---> Client
// Verifying:
// (JWT+Og Signature)-->(HEader+payload)+(Secret)=>JWT Sign.
require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // Token expiry time
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; 
  }
};

module.exports = { generateToken, verifyToken };
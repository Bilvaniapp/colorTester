const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
  permanentId: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    unique: true
  },
  token: {
    type: String
  },
  otpExpiresAt: {
    type: Date
  },
  otp: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const Signup = mongoose.model('Signup', signupSchema);

module.exports = Signup;

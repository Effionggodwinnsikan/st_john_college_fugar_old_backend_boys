/** @format */

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },

  entry_year: {
    type: String,
    required: true,
  },
  exit_year: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Validation for name
userSchema.path('firstname').validate(function (val) {
  return val.length >= 2;
}, 'Firtsname should be of at least 2 characters');

userSchema.path('surname').validate(function (val) {
  return val.length >= 2;
}, 'Surname should be of at least 2 characters');

// Validation for entry_year and exit_year
userSchema.path('entry_year').validate(function (val) {
  return /^\d{4}$/.test(val);
}, 'Entry year should be a 4 digit number');

userSchema.path('exit_year').validate(function (val) {
  return /^\d{4}$/.test(val) && val >= this.entry_year;
}, 'Exit year should be a 4 digit number and greater than or equal to entry year');

// Validation for email
userSchema.path('email').validate(function (val) {
  // Simple regex to validate email format
  var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(val);
}, 'Invalid email');

// Validation for password
userSchema.path('password').validate(function (val) {
  return val.length >= 6;
}, 'Password should be of at least 6 characters');

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

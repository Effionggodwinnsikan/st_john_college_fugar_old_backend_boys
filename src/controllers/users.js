/** @format */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const User = require('../models/users');
const sendEmail = require('../utils/sendEmail');

const register = async (req, res) => {
  try {
    const { firstname, surname, entry_year, exit_year, email, password } =
      req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      firstname,
      surname,
      entry_year,
      exit_year,
      email,
      password,
    });
    user.password = await bcrypt.hash(password, 12);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: 'Registration Successful',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      token,
      user: 'Login Successful',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    User.prototype.createPasswordResetToken = function () {
      const resetToken = crypto.SHA256(Math.random().toString(36)).toString();
      // Hash the reset token using bcrypt
      return bcrypt.hash(resetToken, 12);
    };
    let resetToken = user.createPasswordResetToken();
    console.log(resetToken);
    // Wait for the resetToken to be resolved before proceeding
    resetToken = await resetToken;
    await user.save({ validateBeforeSave: false });

    User.prototype.deletePasswordResetToken = function () {
      this.passwordResetToken = undefined;
      this.passwordResetExpires = undefined;
      return this.save({ validateBeforeSave: false });
    };
    const deleteResetToken = user.deletePasswordResetToken();

    const resetUrl = `http://localhost:4000/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetUrl}. This link will expire in one hour.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });
      res.status(200).json({
        resetToken,
        message: 'Check your email for the password reset link',
      });
    } catch (err) {
      deleteResetToken;
      // await user.save({ validateBeforeSave: false });
      res.status(500).json({ error: err.message });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, password, passwordConfirm } = req.body;

  try {
    const user = await User.findOne({
      passwordResetToken: resetToken,
      // passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Invalid reset token or expired link' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ message: 'Password reset successful. Please log in.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };

// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Update user by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});
// route: PUT /api/users/change-password
router.put('/change-password',async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ success: true, message: 'Password changed successfully.' });
});

module.exports = router;

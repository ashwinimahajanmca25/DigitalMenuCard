const express = require("express");
const Setting = require("../models/Setting.js");

const router = express.Router();

// Get current hotel name
router.get("/hotel-name", async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({ hotelName: "Default Hotel Name" });
    }
    res.json(setting);
  } catch (error) {
    console.error("Error fetching hotel name:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update hotel name
router.put("/hotel-name", async (req, res) => {
  const { hotelName } = req.body;
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
    }
    setting.hotelName = hotelName;
    await setting.save();
    res.json({ message: "Hotel name updated successfully." });
  } catch (error) {
    console.error("Error updating hotel name:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

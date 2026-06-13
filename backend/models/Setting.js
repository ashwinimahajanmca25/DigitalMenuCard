const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
    default: "Default Hotel Name"
  }
});

module.exports = mongoose.model("Setting", settingSchema);

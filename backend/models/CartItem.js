// models/CartItem.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: String,
  price: Number,
  quantity: Number,
});

module.exports = mongoose.model("CartItem", cartItemSchema);

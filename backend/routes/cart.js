const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');

// Add to cart
router.post("/add", async (req, res) => {
  const { userId, productId, name, price, quantity } = req.body;
  console.log("🛒 Incoming body:", req.body); // ✅ See what's missing
  if (!userId || !productId || !name || !price || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingItem = await CartItem.findOne({ userId, productId });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      const newItem = new CartItem({ userId, productId, name, price, quantity });
      await newItem.save();
    }

    res.status(200).json({ message: "Item added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// ✅ Fetch cart items
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const items = await CartItem.find({ userId });
    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
});

// ✅ Delete cart item
router.delete("/delete/:id", async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Error deleting item" });
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const updated = await CartItem.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating cart item" });
  }
});

module.exports = router;

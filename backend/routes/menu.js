// 📁 routes/menu.js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();
require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });
const client = new MongoClient(process.env.MONGO_URI);
const dbName = "MenuCard";
const MenuItem = require('../models/MenuItem');
// // GET all menu items
// router.get("/", async (req, res) => {
//   try {
//     await client.connect();
//     const collection = client.db(dbName).collection("menu_items");
//     const items = await collection.find().toArray();
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching items", error: err });
//   }
// });

// POST a new item
// router.post("/", async (req, res) => {
//     try {
//       const newItem = req.body;
//       console.log("📦 Creating item:", newItem); // <-- Log request body
  
//       await client.connect();
//       const collection = client.db(dbName).collection("menu_items");
//       const result = await collection.insertOne(newItem);
  
//       res.status(201).json({ message: "Item added", id: result.insertedId });
//     } catch (err) {
//       console.error("❌ Error adding item:", err); // <-- Log error
//       res.status(500).json({ message: "Error adding item", error: err });
//     }
//   });
  // Route to upload menu item with image

  
  

// PUT to update an item
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { id } = req.params;

    await client.connect();
    const db = client.db("MenuCard");
    const collection = db.collection("menuitems");
    // ✅ Extract the discount values from req.body
    const half_plate_discount = parseFloat(req.body.half_plate_discount);
    const full_plate_discount = parseFloat(req.body.full_plate_discount);


    const updatedItem = {
      name: req.body.name,
      price: parseFloat(req.body.price),
      description: req.body.description,
      rating: parseFloat(req.body.rating),
      available: req.body.available === "true",
      categoryId: new ObjectId(req.body.categoryId),
      half_plate_discount,
      full_plate_discount,
      updatedAt: new Date(),
    };

    // ✅ Handle new images
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => ({
        data: fs.readFileSync(file.path),
        contentType: file.mimetype,
        filename: file.filename,
        path: file.path,
      }));
      updatedItem.images = images;
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedItem }
    );

    res.json({ message: "Item updated successfully" });
  } catch (err) {
    console.error("❌ Error updating item:", err);
    res.status(500).json({ message: "Error updating item", error: err });
  }
});

  

// DELETE an item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await client.connect();
    const collection = client.db(dbName).collection("menuitems");
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item", error: err });
  }
});

router.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuItem.find().populate('categoryId', 'name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});
router.get("/with-category", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("MenuCard");

    const itemsWithCategory = await db.collection("menuitems").aggregate([
      {
        $lookup: {
          from: "cateogery",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      {
        $unwind: "$categoryDetails"
      },
      {
        $addFields: {
          category: "$categoryDetails.name"
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          rating: 1,
          images: 1,
          category: 1,
          half_plate_discount:1,
          full_plate_discount:1
        }
      }
    ]).toArray();

    res.json(itemsWithCategory);
  } catch (err) {
    console.error("❌ Error fetching menu items with category:", err);
    res.status(500).json({ message: "Error", error: err });
  }
});

module.exports = router;

// 📁 routes/menu.js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "MenuCard";
const Categeory = require('../models/Category');

 //POST a new item
router.post("/addcat", async (req, res) => {
    try {
      const newItem = req.body;
      console.log("📦 Creating Categeory:", newItem); // <-- Log request body
  
      await client.connect();
      const collection = client.db(dbName).collection("cateogery");
      const result = await collection.insertOne(newItem);
  
      res.status(201).json({ message: "Categeory added", id: result.insertedId });
    } catch (err) {
      console.error("❌ Error adding Categeory:", err); // <-- Log error
      res.status(500).json({ message: "Error adding Categeory", error: err });
    }
  });
  
  

// PUT to update an item
router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedItem = { ...req.body };
  
      delete updatedItem._id; // 🔥 IMPORTANT: remove _id from update
  
      await client.connect();
      const collection = client.db(dbName).collection("cateogery");
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedItem });
  
      res.json({ message: "cateogery updated" });
    } catch (err) {
      console.error("❌ Error updating cateogery:", err);
      res.status(500).json({ message: "Error updating cateogery", error: err });
    }
  });
  
  

// DELETE an item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await client.connect();
    const collection = client.db(dbName).collection("cateogery");
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "cateogery deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting cateogery", error: err });
  }
});


router.get("/with-counts", async (req, res) => {
    try {
      await client.connect();
      const db = client.db("MenuCard");
  
      const categoriesWithCount = await db.collection("cateogery").aggregate([
        {
          $lookup: {
            from: "menuitems",
            localField: "_id",
            foreignField: "categoryId",
            as: "items"
          }
        },
        {
          $addFields: {
            itemCount: { $size: "$items" }
          }
        },
        {
          $project: {
            name: 1,
            description: 1,
            itemCount: 1
          }
        }
      ]).toArray();
  
      res.json(categoriesWithCount);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch category counts", detail: err });
    }
  });
  

module.exports = router;

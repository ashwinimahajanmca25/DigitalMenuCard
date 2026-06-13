const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Route to upload menu item with images
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    await client.connect();
    const db = client.db("MenuCard");
    const collection = db.collection("menuitems");

    // Step 1: Fetch category by ID
    const category = await db
      .collection("cateogery")
      .findOne({ _id: new ObjectId(req.body.categoryId) });

    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    // Step 2: Process uploaded images
    const images = req.files.map((file) => ({
      data: fs.readFileSync(file.path),
      contentType: file.mimetype,
      filename: file.filename,
      path: file.path,
    }));

    // Step 3: Parse discounts
    const half_plate_discount = parseFloat(req.body.half_plate_discount) || 0;
    const full_plate_discount = parseFloat(req.body.full_plate_discount) || 0;

    const newItem = {
      name: req.body.name,
      price: parseFloat(req.body.price),
      description: req.body.description,
      rating: parseFloat(req.body.rating),
      available: req.body.available === "true",
      categoryId: category._id,
      images,
      half_plate_discount,
      full_plate_discount,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newItem);
    res.status(201).json({ message: "Item added", id: result.insertedId });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// Route to get image by item ID and index
router.get("/image/:id/:index", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("MenuCard");
    const collection = db.collection("menuitems");

    const item = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });

    const index = parseInt(req.params.index, 10) || 0;
    const image = item?.images?.[index];

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set("Content-Type", image.contentType);
    res.send(image.data.buffer); // or just `image.data` depending on format
  } catch (err) {
    console.error("Image fetch error:", err);
    res.status(500).json({ message: "Error retrieving image", error: err });
  }
});

module.exports = router;

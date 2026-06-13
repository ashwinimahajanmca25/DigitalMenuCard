require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const cors = require("cors");
// Import the menu routes
const menuRoutes = require("./routes/menu");
const cateogeryRoutes = require("./routes/categoryRoutes");
const itemRoutes = require("./routes/itemRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingRoutes = require ('./routes/settingRoutes.js');
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user");
const cartRoutes = require('./routes/cart');
const multerConfig = require("./multerConfig");
const app = express();
app.use(cors());
const port = 5000;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

app.use(express.json());
app.use("/dashboard", dashboardRoutes);
app.use("/menu", menuRoutes);
app.use("/admin/category", cateogeryRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/itemroutes", itemRoutes);
app.use('/imageuploads',multerConfig);
app.use('/api/setting', settingRoutes);
app.use("/api/auth", authRoutes );

app.use("/api/cart", cartRoutes);

app.use("/api/users", userRoutes);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

let db;

client.connect().then(() => {
  db = client.db("MenuCard");
  console.log("✅ MongoDB connected");
  const ADMIN_USER = {
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin"
  };
  

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      return res.json({ success: true, role: "admin" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
  // Move route handlers inside this block to ensure DB is ready
  app.get("/menuitems", async (req, res) => {
    try {

  
      const items = await db.collection("menuitems").find().toArray();
      res.json(items);

    } catch (err) {
      console.error("❌ Error:", err);
      res.status(500).json({ message: "Error fetching items", error: err });
    }
  });

  app.get("/category", async (req, res) => {
    try {
      const collection = db.collection("cateogery");
      const cateogery = await collection.find().toArray();
      res.json(cateogery);
    } catch (err) {
      res.status(500).json({ message: "Error fetching items", error: err });
    }
  });

  // Start server only after DB is ready
  app.listen(port, () => {
    console.log(`✅ Backend server running at http://localhost:${port}`);
  });
});

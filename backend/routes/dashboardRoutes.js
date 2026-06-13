const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

router.get("/dashboard-stats", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("MenuCard");

    const totalCategories = await db.collection("cateogery").countDocuments();
    const totalItems = await db.collection("menuitems").countDocuments();

    const topCategoryAgg = await db.collection("menuitems").aggregate([
      {
        $group: {
          _id: "$categoryId",
          itemCount: { $sum: 1 }
        }
      },
      {
        $sort: { itemCount: -1 }
      },
      {
        $limit: 1
      },
      {
        $lookup: {
          from: "cateogery",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: "$category"
      },
      {
        $project: {
          categoryName: "$category.name",
          itemCount: 1
        }
      }
    ]).toArray();

    res.json({
      totalCategories,
      totalItems,
      topCategory: topCategoryAgg[0] || null
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Failed to load stats", error: err });
  }
});



module.exports = router;

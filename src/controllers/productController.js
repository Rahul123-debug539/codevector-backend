const mongoose = require("mongoose");
const Product = require("../models/Product");
const { encodeCursor, decodeCursor } = require("../utils/cursor");

const getProducts = async (req, res) => {
  try {
    let { limit = 20, category, cursor } = req.query;

    // ---------------------------
    // Validate Limit
    // ---------------------------
    limit = parseInt(limit, 10);

    if (Number.isNaN(limit) || limit <= 0) {
      limit = 20;
    }

    if (limit > 100) {
      limit = 100;
    }

    // ---------------------------
    // Snapshot Time
    // ---------------------------
    let snapshotTime = new Date();

    // ---------------------------
    // Query Builder
    // ---------------------------
    const filters = [];

    if (category) {
      filters.push({
        category: category.trim(),
      });
    }

    // ---------------------------
    // Cursor Handling
    // ---------------------------
    if (cursor) {
      const decoded = decodeCursor(cursor);

      if (!decoded) {
        return res.status(400).json({
          success: false,
          message: "Invalid cursor.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid cursor.",
        });
      }

      snapshotTime = new Date(decoded.snapshotTime);

      const cursorDate = new Date(decoded.updatedAt);

      filters.push({
        $or: [
          {
            updated_at: {
              $lt: cursorDate,
            },
          },
          {
            updated_at: cursorDate,
            _id: {
              $lt: new mongoose.Types.ObjectId(decoded.id),
            },
          },
        ],
      });
    }

    // Freeze dataset for current browsing session
    filters.push({
      updated_at: {
        $lte: snapshotTime,
      },
    });

    const query =
      filters.length > 0
        ? {
            $and: filters,
          }
        : {};

    // ---------------------------
    // Fetch Products
    // ---------------------------
    const products = await Product.find(query)
      .sort({
        updated_at: -1,
        _id: -1,
      })
      .limit(limit + 1)
      .lean();

    // ---------------------------
    // Pagination
    // ---------------------------
    let hasMore = false;
    let nextCursor = null;

    if (products.length > limit) {
      hasMore = true;

      const lastVisibleProduct = products[limit - 1];

      nextCursor = encodeCursor({
        snapshotTime,
        updatedAt: lastVisibleProduct.updated_at,
        id: lastVisibleProduct._id,
      });

      products.pop();
    }

    // ---------------------------
    // Response
    // ---------------------------
    return res.status(200).json({
      success: true,
      count: products.length,
      hasMore,
      nextCursor,
      products,
    });
  } catch (error) {
    console.error("Product Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getProducts,
};
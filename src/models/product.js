const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    created_at: {
      type: Date,
      required: true,
      default: Date.now,
    },

    updated_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
| 1. updated_at + _id
|    Used for cursor-based pagination (newest first).
|
| 2. category + updated_at + _id
|    Used when category filter is applied with pagination.
|--------------------------------------------------------------------------
*/

productSchema.index({
  updated_at: -1,
  _id: -1,
});

productSchema.index({
  category: 1,
  updated_at: -1,
  _id: -1,
});

module.exports = mongoose.model("Product", productSchema);
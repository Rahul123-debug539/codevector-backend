require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const connectDB = require("../src/config/db");
const Product = require("../src/models/Product");

const categories = [
  "Electronics",
  "Fashion",
  "Books",
  "Home",
  "Sports",
  "Beauty",
  "Toys",
  "Groceries",
];

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 5000;

const generateProduct = () => {
  const createdAt = faker.date.between({
    from: new Date("2024-01-01"),
    to: new Date(),
  });

  const updatedAt = faker.date.between({
    from: createdAt,
    to: new Date(),
  });

  return {
    name: faker.commerce.productName(),

    category: faker.helpers.arrayElement(categories),

    price: Number(faker.commerce.price({ min: 100, max: 100000, dec: 2 })),

    created_at: createdAt,

    updated_at: updatedAt,
  };
};

const seedProducts = async () => {
  try {
    await connectDB();

    console.log("Deleting old products...");

    await Product.deleteMany();

    console.log("Generating products...");

    let inserted = 0;

    while (inserted < TOTAL_PRODUCTS) {
      const batch = [];

      const currentBatch = Math.min(
        BATCH_SIZE,
        TOTAL_PRODUCTS - inserted
      );

      for (let i = 0; i < currentBatch; i++) {
        batch.push(generateProduct());
      }

      await Product.insertMany(batch);

      inserted += currentBatch;

      console.log(`${inserted}/${TOTAL_PRODUCTS} inserted`);
    }

    console.log("Seed completed successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seedProducts();
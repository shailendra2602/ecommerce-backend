
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import addressRoutes from "./src/routes/addressRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/products", productRoutes);
// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API server is running",
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Connect MongoDB and start server
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in the .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

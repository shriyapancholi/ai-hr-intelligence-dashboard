const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Test
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = 5004;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
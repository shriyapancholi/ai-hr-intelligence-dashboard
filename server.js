const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// DEBUG (important)
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// DB
connectDB();

// ROUTES (IMPORTANT)
app.use("/api/auth", authRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
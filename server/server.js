const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const transcriptRoutes = require("./routes/transcriptRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/transcripts", transcriptRoutes);

// Test
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = 5004;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
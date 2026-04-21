const express = require("express");
const router = express.Router();

const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  searchEmployees
} = require("../controllers/employeeController");

router.get("/", getEmployees);
router.get("/search", searchEmployees);   // 🔥 IMPORTANT
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);         // (no /add needed)

module.exports = router;
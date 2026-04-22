const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  searchEmployees,
} = require("../controllers/employeeController");

router.get("/", auth, getEmployees);
router.get("/search", auth, searchEmployees);
router.get("/:id", auth, getEmployeeById);
router.post("/", auth, createEmployee);
router.put("/:id", auth, updateEmployee);

module.exports = router;

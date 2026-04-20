const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const auth = require("../middleware/auth");

router.get("/", auth, employeeController.getEmployees);
router.get("/:id", auth, employeeController.getEmployeeById);
router.post("/", auth, employeeController.createEmployee);

module.exports = router;
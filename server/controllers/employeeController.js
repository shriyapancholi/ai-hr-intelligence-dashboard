const Employee = require("../models/Employee");

// GET ALL EMPLOYEES
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD EMPLOYEE
exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 SEARCH BY DEPARTMENT (YOUR TASK)
exports.searchEmployees = async (req, res) => {
  try {
    const { department } = req.query;

    let filter = {};
    if (department) filter.department = department;

    const employees = await Employee.find(filter);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
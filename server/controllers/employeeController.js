const Employee = require("../models/Employee");

// GET ALL EMPLOYEES (with pagination)
exports.getEmployees = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(1000, Math.max(1, parseInt(req.query.limit) || 500));
    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Employee.find().skip(skip).limit(limit),
      Employee.countDocuments(),
    ]);

    res.json({ employees, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

// GET BY ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employee" });
  }
};

// ADD EMPLOYEE — only accept known fields
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, department, role, sentimentScore, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const employee = new Employee({ name, email, department, role, sentimentScore, notes });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Failed to create employee" });
  }
};

// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, department, role, sentimentScore, notes } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, department, role, sentimentScore, notes },
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Failed to update employee" });
  }
};

// SEARCH BY DEPARTMENT
exports.searchEmployees = async (req, res) => {
  try {
    const { department } = req.query;

    const filter = {};
    if (department) filter.department = department;

    const employees = await Employee.find(filter).limit(100);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

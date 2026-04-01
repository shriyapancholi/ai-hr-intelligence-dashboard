const Employee = require("../models/Employee");

exports.getEmployees = async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
};

exports.getEmployeeById = async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    res.json(employee);
};

exports.createEmployee = async (req, res) => {
    const employee = new Employee(req.body);
    await employee.save();
    res.json(employee);
};
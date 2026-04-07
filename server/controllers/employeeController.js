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
exports.getStats = async (req, res) => {
  const totalEmployees = await Employee.countDocuments();

  const avgSentiment = await Employee.aggregate([
    { $group: { _id: null, avg: { $avg: "$sentimentScore" } } }
  ]);

  res.json({
    totalEmployees,
    avgSentiment: avgSentiment[0]?.avg || 0
  });
};

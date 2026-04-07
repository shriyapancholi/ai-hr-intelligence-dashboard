const mongoose = require("mongoose");
require("dotenv").config();

const Employee = require('./models/employee');
const Meeting = require('./models/meeting');

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    await Employee.deleteMany();
    await Meeting.deleteMany();

    await Employee.insertMany([
      { name: "Alice", department: "Engineering", sentiment: 8 },
      { name: "Bob", department: "Product", sentiment: 6 },
      { name: "Charlie", department: "Marketing", sentiment: 4 },
      { name: "David", department: "Engineering", sentiment: 9 },
      { name: "Eve", department: "HR", sentiment: 3 }
    ]);

    await Meeting.insertMany([
      { date: new Date() },
      { date: new Date() },
      { date: new Date() }
    ]);

    console.log("Data Seeded ✅");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedData();
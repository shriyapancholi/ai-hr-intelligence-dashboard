const Reminder = require("../models/Reminder");

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ createdBy: req.user.id }).sort({ date: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
};

exports.createReminder = async (req, res) => {
  try {
    const { title, employeeId, employeeName, date, priority, notes } = req.body;
    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }
    const reminder = await Reminder.create({
      title,
      employeeId: employeeId || undefined,
      employeeName,
      date,
      priority,
      notes,
      createdBy: req.user.id,
    });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: "Failed to create reminder" });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: "Failed to update reminder" });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete reminder" });
  }
};

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Employee Schema & Model
const EmployeeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  enabled: { type: Boolean, required: true, default: false },
  workingDays: [
    {
      weekDay: {
        type: String,
        enum: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      },
      workingHours: [{ start: String, end: String }]
    }
  ],
  title: { type: String, required: true, default: "Especialista" },
  salesCommission: { type: Number, default: 10 },
  worksSince: { type: Date, default: Date.now },
  salary: { type: Number, default: 1 },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  createdAt: { type: Date, default: Date.now }
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;

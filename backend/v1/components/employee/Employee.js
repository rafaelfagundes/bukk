const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Service = require("../service/Service");

// Employee Schema & Model
const EmployeeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  workingDays: [
    {
      weekDay: {
        type: String,
        enum: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      },
      workingHours: [{ start: String, end: String }]
    }
  ],
  title: { type: String, required: true },
  salesCommission: { type: Number, default: 100 },
  worksSince: { type: Date },
  salary: { type: Number },
  services: [Service],
  avatar: { type: String }
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;

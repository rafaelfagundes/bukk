const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CostumerSchema = require("../costumer/Costumer").schema.obj;
const EmployeeSchema = require("../employee/Employee").schema.obj;
const ServiceSchema = require("../service/Service").schema.obj;
const UserSchema = require("../user/User").schema.obj;

// Appointment Schema & Model
const AppointmentSchema = new Schema({
  confirmationId: { type: String, required: true },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
  costumer: { type: CostumerSchema },
  employee: { type: EmployeeSchema },
  user: { type: UserSchema },
  service: { type: ServiceSchema },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["canceled", "confirmed", "created", "done", "missed", "payed"]
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;

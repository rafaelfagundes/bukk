const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Appointment Schema & Model
const AppointmentSchema = new Schema({
  confirmationId: { type: String, required: true },
  costumer: { type: Schema.Types.ObjectId, ref: "Costumer" },
  employee: { type: Schema.Types.ObjectId, ref: "Employee" },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
  service: { type: Schema.Types.ObjectId, ref: "Service" },
  value: { type: Number, required: true },
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

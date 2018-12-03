const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Appointment Schema & Model
const AppointmentSchema = new Schema({
  costumer: { type: Schema.Types.ObjectId, ref: "Costumer" },
  employee: { type: Schema.Types.ObjectId, ref: "Employee" },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["canceled", "confirmed", "created", "done", "missed", "payed"]
  },
  notes: { type: String }
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;

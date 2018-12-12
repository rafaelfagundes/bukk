const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Service Schema & Model
const ServiceSchema = new Schema({
  desc: { type: String, required: true },
  value: { type: Number, required: true },
  duration: { type: Number, required: true }, // Minutes
  products: [{ desc: String, value: Number, units: Number }],
  display: { type: Boolean, required: true },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
  createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;

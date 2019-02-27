const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Costumer Schema & Model
const CostumerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String },
  email: { type: String },
  gender: { type: String, required: true, enum: ["M", "F", "O"] },
  phone: [
    {
      number: { type: String, required: true },
      whatsApp: { type: Boolean, required: true, default: false }
    }
  ],
  company: { type: Schema.Types.ObjectId, ref: "Company" },
  createdAt: { type: Date, default: Date.now }
});

CostumerSchema.index({
  "$**": "text"
});

CostumerSchema.pre("save", function(next) {
  this.fullName = this.firstName + " " + this.lastName;
  next();
});

const Costumer = mongoose.model("Costumer", CostumerSchema);
module.exports = Costumer;

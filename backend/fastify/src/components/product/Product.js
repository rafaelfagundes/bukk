const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Product Schema & Model
const ProductSchema = new Schema({
  desc: { type: String, required: true },
  value: { type: Number, required: true },
  units: { type: Number, required: true },
  display: { type: Boolean, required: true },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;

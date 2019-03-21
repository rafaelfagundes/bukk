const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  bytes: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["logo", "avatar", "default"]
  },
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  createdAt: { type: Date, default: Date.now },
  format: { type: String, required: true },
  height: { type: Number, required: true },
  mimetype: { type: String, required: true },
  secureUrl: { type: String, required: true },
  title: { type: String },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  version: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  width: { type: Number, required: true }
});

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;

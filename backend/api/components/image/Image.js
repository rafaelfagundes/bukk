const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  fieldname: { type: String },
  originalname: { type: String },
  encoding: { type: String },
  mimetype: { type: String },
  public_id: { type: String },
  version: { type: Number },
  signature: { type: String },
  width: { type: Number },
  height: { type: Number },
  format: { type: String },
  resource_type: { type: String },
  created_at: { type: String },
  tags: [String],
  bytes: { type: Number },
  type: { type: String },
  etag: { type: String },
  placeholder: { type: Boolean },
  url: { type: String },
  secure_url: { type: String },
  original_filename: { type: String }
});

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;

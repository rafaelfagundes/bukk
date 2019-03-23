const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Notification Schema & Model
const NotificationSchema = new Schema({
  company: { type: Schema.Types.ObjectId, ref: "Company" },
  title: { type: String, required: true },
  text: { type: String, required: true },
  cellphone: { type: String, required: true },
  email: { type: String, required: true },
  confirmationId: { type: String, required: true },

  status: {
    type: String,
    required: true,
    enum: ["queued", "error", "sent"]
  },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;

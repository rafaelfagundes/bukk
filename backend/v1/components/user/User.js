const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema & Model -
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "O primeiro nome é obrigatório"]
  },
  lastName: { type: String, required: [true, "O sobrenome é obrigatório"] },
  username: {
    type: String,
    required: [true, "O nome de usuário é obrigatório"]
  },
  email: { type: String, required: [true, "O email é obrigatório"] },
  password: { type: String, required: [true, "A senha é obrigatória"] },
  created: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["company", "owner", "manager", "supervisor", "employee"],
    default: "company"
  }
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
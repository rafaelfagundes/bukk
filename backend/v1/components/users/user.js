const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema & Model
const UserSchema = new Schema({
  username: { type: String, required: [true, "O nome é obrigatório"] },
  email: { type: String, required: [true, "O email é obrigatório"] }
});

const User = mongoose.model("user", UserSchema);
module.exports = User;

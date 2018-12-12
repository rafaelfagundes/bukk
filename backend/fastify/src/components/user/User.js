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
  gender: { type: String, enum: ["M", "F", "O"] },
  birthday: { type: Date },
  email: { type: String, required: [true, "O email é obrigatório"] },
  password: { type: String, required: [true, "A senha é obrigatória"] },
  created: { type: Date, default: Date.now, required: true },
  role: {
    type: String,
    enum: ["owner", "manager", "supervisor", "employee"],
    default: "owner",
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    number: {
      type: Number,
      required: true
    },
    neighborhood: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    postalCode: {
      type: Number,
      required: true
    },
    geolocation: {
      lat: { type: String },
      lng: { type: String }
    }
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company"
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
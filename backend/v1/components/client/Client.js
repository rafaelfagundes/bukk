const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Client Schema & Model
const ClientSchema = new Schema({
  firstName: { type: String, required: [true, "O nome é obrigatório"] },
  lastName: { type: String, required: [true, "O nome é obrigatório"] },
  email: { type: String, required: [true, "O email é obrigatório"] }
});

const Client = mongoose.model("Client", ClientSchema);
module.exports = Client;

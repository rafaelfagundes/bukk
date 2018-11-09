const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Profile Schema & Model
const ProfileSchema = new Schema({});

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;

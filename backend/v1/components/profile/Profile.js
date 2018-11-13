const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Profile Schema & Model
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  gender: { type: String, required: true, enum: ["M", "F"] },
  birthday: { type: Date },
  title: { type: String },
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
      type: String,
      required: true
    },
    geolocation: {
      lat: { type: String },
      lng: { type: String }
    }
  },
  website: { type: String },
  social: [
    {
      socialNetwork: { type: String },
      socialId: { type: String }
    }
  ],
  phone: [
    {
      number: { type: String },
      phoneType: {
        type: String,
        enum: ["cellphone", "landline", "fax"],
        default: "landline"
      },
      whatsAppEnabled: { type: Boolean }
    }
  ]
});

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Profile Schema & Model
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  userType: {
    type: String,
    enum: ["individual", "company"],
    default: "individual"
  },
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
  social: {
    facebookProfile: { type: String },
    twitterProfile: { type: String },
    instagramProfile: { type: String },
    pinterestProfile: { type: String },
    linkedinProfile: { type: String }
  },
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
  ],
  companyName: {
    type: String,
    required: true
  },
  workingDays: [
    {
      weekDay: {
        type: String,
        enum: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      },
      workingHours: [{ start: String, end: String }]
    }
  ],
  salesCommission: { type: Number, default: 100 },
  worksSince: { type: Date },
  salary: { type: Number }
});

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;

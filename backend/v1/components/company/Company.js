const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Company Schema & Model
const CompanySchema = new Schema({
  companyName: { type: String }, // Razão Social
  tradingName: { type: String, required: true }, // Nome Fantasia
  companyNickname: { type: String }, // Optional name to show on interface
  cpfCnpj: { type: String, required: true },
  businessType: { type: String, required: true, enum: ["física", "jurídica"] }, // Pessoa Física, Pessoa Jurídica
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
  workingDays: [
    {
      weekDay: {
        type: String,
        enum: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      },
      workingHours: [{ start: String, end: String }]
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
  ],
  created: { type: Date, required: true, default: Date.now }
});

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;

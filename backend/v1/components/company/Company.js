const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Company Schema & Model
const CompanySchema = new Schema({
  companyName: { type: String }, // Razão Social
  tradingName: { type: String, required: true }, // Nome Fantasia
  companyNickname: { type: String }, // Optional name to show on interface
  cpfCnpj: { type: String, required: true, unique: true },
  businessType: { type: String, required: true, enum: ["f", "j"] }, // Pessoa Física, Pessoa Jurídica
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
        enum: ["cellphone", "landline", "fax"]
      },
      whatsAppEnabled: { type: Boolean }
    }
  ],
  created: { type: Date, default: Date.now },
  paymentOptions: [
    {
      paymentType: {
        type: String,
        required: true,
        enum: ["cash", "credit card", "debit card", "boleto", "transfer"]
      },
      paymentDesc: { type: String, required: true }
    }
  ]
});

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;

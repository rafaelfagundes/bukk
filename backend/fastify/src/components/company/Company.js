const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Company Schema & Model
const CompanySchema = new Schema({
  companyName: { type: String }, // Razão Social
  tradingName: { type: String, required: true }, // Nome Fantasia
  companyNickname: { type: String }, // Optional name to show on interface
  cpfCnpj: { type: String, required: true, unique: true },
  businessType: { type: String, required: true, enum: ["F", "J"] }, // Pessoa Física, Pessoa Jurídica
  logo: { type: String, required: true },
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
  website: { type: String },
  email: { type: String },
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
  createdAt: { type: Date, default: Date.now },
  paymentOptions: [
    {
      paymentId: { type: String },
      paymentType: {
        type: String,
        enum: ["credit card", "cash", "money transfer", "boleto"]
      },
      name: { type: String },
      icon: { type: String }
    }
  ],
  settings: {
    colors: {
      primary: { type: String, required: true, default: "#800080" },
      secondary: { type: String, required: true, default: "46, 86%" },
      header: { type: String, required: true, default: "#800080" },
      confirmation: { type: String, required: true, default: "#21ba45" },
      contrastColor: { type: String, required: true, default: "#FFFFFF" },
      confirmationContrastColor: {
        type: String,
        required: true,
        default: "#FFFFFF"
      }
    },
    options: {
      disableMarginTopBooker: { type: Boolean, required: true, default: false },
      disableHeader: { type: Boolean, required: true, default: false },
      disableBorder: { type: Boolean, required: true, default: false },
      disableBorderRadius: { type: Boolean, required: true, default: false },
      centerLogo: { type: Boolean, required: true, default: false },
      roundedLogo: { type: Boolean, required: true, default: false },
      squareLogo: { type: Boolean, required: true, default: false },
      softSquareLogo: { type: Boolean, required: true, default: false },
      disableLogo: { type: Boolean, required: true, default: false },
      showCompanyNickname: { type: Boolean, required: true, default: false },
      dropShadowBooker: { type: Boolean, required: true, default: false },
      dropShadowComponents: { type: Boolean, required: true, default: false }
    }
  }
});

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;

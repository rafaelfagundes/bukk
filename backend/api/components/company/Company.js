const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Company Schema & Model
const CompanySchema = new Schema({
  companyName: { type: String },
  tradingName: { type: String, required: true },
  companyNickname: { type: String },
  cpfCnpj: { type: String, required: true, unique: true },
  businessType: { type: String, required: true, enum: ["F", "J"] },
  logo: { type: String },
  logoId: { type: Schema.Types.ObjectId, ref: "Image" },
  address: {
    street: {
      type: String,
      required: true
    },
    number: {
      type: String,
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
        enum: ["cc", "other"]
      },
      name: { type: String },
      icon: { type: String }
    }
  ],
  settings: {
    colors: {
      primaryBack: { type: String, required: true, default: "#800080" },
      primaryText: { type: String, required: true, default: "#FFFFFF" },
      secondaryBack: { type: String, required: true, default: "#CCFF66" },
      secondaryText: { type: String, required: true, default: "#222222" },
      headerBack: { type: String, required: true, default: "#800080" },
      headerText: { type: String, required: true, default: "#FFFFFF" },
      confirmationBack: { type: String, required: true, default: "#21BA45" },
      confirmationText: { type: String, required: true, default: "#FFFFFF" }
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
    },
    appointment: {
      rules: [
        {
          type: String
        }
      ]
    }
  }
});

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;

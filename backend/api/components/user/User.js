const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

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
  avatar: { type: String },
  gender: { type: String, enum: ["M", "F", "O"] },
  birthday: { type: Date },
  email: { type: String, required: [true, "O email é obrigatório"] },
  password: { type: String, required: [true, "A senha é obrigatória"] },
  createdAt: { type: Date, default: Date.now },
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

UserSchema.pre("save", function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

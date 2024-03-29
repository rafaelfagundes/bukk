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
  avatarId: { type: Schema.Types.ObjectId, ref: "Image" },
  avatar: {
    type: String,
    required: true,
    default:
      "https://res.cloudinary.com/bukkapp/image/upload/v1547558890/Bukk/Assets/User/Avatars/user.png"
  },
  gender: { type: String, required: true, enum: ["M", "F", "O"], default: "O" },
  birthday: { type: Date, default: Date.now },
  email: {
    type: String,
    required: [true, "O email é obrigatório"],
    unique: true
  },
  phone: {
    type: String,
    default: ""
  },
  password: { type: String, required: [true, "A senha é obrigatória"] },
  createdAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["owner", "manager", "supervisor", "employee"],
    default: "employee",
    required: true
  },
  address: {
    street: {
      type: String,
      default: ""
    },
    number: {
      type: String,
      default: ""
    },
    neighborhood: {
      type: String,
      default: ""
    },
    city: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: ""
    },
    country: {
      type: String,
      default: ""
    },
    postalCode: {
      type: String,
      default: ""
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

function createPassword(next) {
  const password = this.getUpdate().password;

  // if not password change
  if (!password) {
    return next();
  }
  try {
    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    console.log(salt);
    const hash = bcrypt.hashSync(password, salt);
    console.log(hash);
    this.getUpdate().password = hash;
    next();
  } catch (error) {
    return next(error);
  }
}

UserSchema.pre("update", createPassword);
UserSchema.pre("updateOne", createPassword);

UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

const fs = require("fs");
const jwt = require("jsonwebtoken");

const config = require("./config/config");
const privateKey = fs.readFileSync("./config/jwtprivate.key", "utf8");
const publicKey = fs.readFileSync("./config/jwtpublic.key", "utf8");

module.exports = {
  sign: payload => {
    var signOptions = {
      issuer: config.jwt.issuer,
      subject: config.jwt.subject,
      audience: config.jwt.audience,
      expiresIn: config.jwt.expiresIn,
      algorithm: config.jwt.algorithm
    };
    try {
      return jwt.sign(payload, privateKey, signOptions);
    } catch (err) {
      return null;
    }
  },
  verify: token => {
    var verifyOptions = {
      issuer: config.jwt.issuer,
      subject: config.jwt.subject,
      audience: config.jwt.audience,
      expiresIn: config.jwt.expiresIn,
      algorithm: [config.jwt.algorithm]
    };
    try {
      return jwt.verify(token, publicKey, verifyOptions);
    } catch (err) {
      return false;
    }
  },
  decode: token => {
    return jwt.decode(token, { complete: true });
    //returns null if token is invalid
  }
};

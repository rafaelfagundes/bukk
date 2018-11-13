module.exports = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET_OR_KEY,
  mailgun: {
    key: process.env.mailgunKey,
    domain: process.env.mailgunDomain,
    defaultEmail: process.env.mailgunDefaultEmail
  }
};

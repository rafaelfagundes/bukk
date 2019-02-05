module.exports = {
  mongoURI: process.env.MONGO_URI,
  mailgun: {
    key: process.env.mailgunKey,
    domain: process.env.mailgunDomain,
    defaultEmail: process.env.mailgunDefaultEmail
  }
};

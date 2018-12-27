const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const userRoutes = require("./components/user/userAPI");
const mailRoutes = require("./components/mail/mailAPI");
const imageRoutes = require("./components/image/imageAPI");
const appointmentRoutes = require("./components/appointment/appointmentAPI");
const qrcodeRoutes = require("./components/qrcode/qrcodeAPI");

const keys = require("./config/config");

// config consts
const PORT = 4000;
const BASE_URL = "/api/v1";

// console setup
console.clear();
console.log("BUKK SERVER\n" + "-".repeat(80) + "\n");

// setup express app
const app = express();

// morgan
app.use(morgan("dev"));

// mongoose setup
mongoose.Promise = global.Promise;
mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("✅  MongoDB connected"))
  .catch(error => console.log(`⛔  ${error}`));

// cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// body parser
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());
require("./config/passport")(passport);

// routes
app.use(BASE_URL, [
  userRoutes,
  mailRoutes,
  imageRoutes,
  appointmentRoutes,
  qrcodeRoutes
]);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

app.listen(process.env.port || PORT, () => {
  console.log(`👂  Listen to requests on port ${process.env.port || PORT}`);
  console.log(
    `🔌  Endpoint is probably: http://localhost:${process.env.port ||
      PORT}${BASE_URL}`
  );
});

module.exports = app;

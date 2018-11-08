const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const usersRoutes = require("./components/users/usersAPI");
const clientsRoutes = require("./components/clients/clientsAPI");

const keys = require("./config/keys");

// config consts
const PORT = 4000;
const BASE_URL = "/api/v1";

// console setup
console.clear();
console.log("BUKK SERVER\n" + "-".repeat(80) + "\n");

// setup express app
const app = express();

// mongoose setup
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
app.use(BASE_URL, [usersRoutes, clientsRoutes]);

app.listen(process.env.port || PORT, () => {
  console.log(`👂  Listen to requests on port ${process.env.port || PORT}`);
  console.log(
    `🔌  Endpoint is probably: http://localhost:${process.env.port ||
      PORT}${BASE_URL}`
  );
});

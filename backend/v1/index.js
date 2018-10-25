const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const usersRoutes = require("./components/users/usersAPI");
const clientsRoutes = require("./components/clients/clientsAPI");

// mongoose setup
mongoose.connect(
  "mongodb://localhost/bukk",
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;

// setup express app
const app = express();

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

// routes
app.use("/api/v1", [usersRoutes, clientsRoutes]);

// listen for requests
const PORT = 4000;
app.listen(process.env.port || PORT, () => {
  console.log("Listen to resquests on port: " + PORT);
});

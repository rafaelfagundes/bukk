const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const config = require("./config/config");
const app = express();

// console setup
console.clear();
console.log("BUKK SERVER\n" + "-".repeat(80) + "\n");

// morgan
app.use(morgan("dev"));

// config consts
const PORT = 4000;

// mongoose setup
mongoose.Promise = global.Promise;
mongoose
  .connect(
    config.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch(error => console.log(`⛔ ${error}`));

// cors
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// body parser
app.use(bodyParser.json());

// routes
app.use(require("./routes"));

const server = app.listen(process.env.port || PORT, function() {
  console.log(
    `🔌 Server listening. ${server.address().address}:${server.address().port}`
  );
});

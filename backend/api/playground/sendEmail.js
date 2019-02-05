const fs = require("fs");
const mongoose = require("mongoose");
const config = require("../config/config");

const {
  newAppointment,
  newEmployee
} = require("../components/mail/templates/emailTemplates");

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const _confirmationId = "0bXVlbt8W";

start = async () => {
  let template = await newEmployee(
    "5c3e0d49eeeedc6846411e0e",
    "Rafael",
    "rafaelcflima@gmail.com",
    "78hSD&*G&#"
  );
  fs.writeFile(
    "/home/rafael/Desktop/temp/template.html",
    template.html,
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("The HTML file was saved!");
    }
  );

  fs.writeFile(
    "/home/rafael/Desktop/temp/template.txt",
    template.text,
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("The TXT file was saved!");
    }
  );
};

start();

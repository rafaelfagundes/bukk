const cron = require("node-cron");
const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");

// const config = require("../../config/config");

const Appointment = require("../appointment/Appointment");

const connect = async () => {
  mongoose.Promise = global.Promise;
  await mongoose
    .connect("mongodb://localhost:27017/bukk", { useNewUrlParser: true })
    .then(() => console.log("✅ MongoDB connected"))
    .catch(error => console.log(`⛔ ${error}`));
};

const getAppointments = async () => {
  const now = moment()
    .add(1, "day")
    .startOf("day");
  const tomorrow = moment()
    .add(1, "day")
    .endOf("day");
  // console.log(now.toString(), tomorrow.toString());
  const _appointments = await Appointment.find({
    start: { $gte: now.toDate(), $lte: tomorrow.toDate() }
  });
  return _appointments;
};

const setNotifications = async appointments => {
  console.log(appointments.length);
};

const start = async () => {
  console.time("@start");
  // console.log(
  //   `[${moment(Date.now()).format("DD/MM/YYYY HH:mm:ss")}] - Running...`
  // );
  const appointments = await getAppointments();
  setNotifications(appointments);
  console.timeEnd("@start");
};

async function main() {
  await connect();

  start();

  // cron.schedule("* * * * *", start);
}

main();

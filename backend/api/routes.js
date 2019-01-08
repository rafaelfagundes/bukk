const express = require("express");
const router = express.Router();

const company = require("./components/company/companyController");
const service = require("./components/service/serviceController");
const specialist = require("./components/employee/employeeController");
const appointment = require("./components/appointment/appointmentController");

//Middle ware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

const BASE_URL = "/api";

// Define the home page route
router.get(BASE_URL + "/", function(req, res) {
  res.send("home page");
});

// Define the about route
router.get(BASE_URL + "/about", function(req, res) {
  res.send("About us");
});

/*============================================================
Company
============================================================*/
router.get(BASE_URL + "/companies/:id", company.getSingleCompany);
router.get(BASE_URL + "/companies/css/:id", company.getCompanyCss);

/*============================================================
Service
============================================================*/

router.get(
  BASE_URL + "/services/company/:companyId",
  service.getServicesByCompany
);

/*============================================================
Specialist (Employee)
============================================================*/

router.get(
  BASE_URL + "/specialists/company/:companyId",
  specialist.getEmployeesByCompany
);

router.get(
  BASE_URL +
    "/specialists/schedule/:companyId/date/:date/duration/:serviceDuration",
  specialist.getSchedule
);

/*============================================================
Appointment
============================================================*/
router.post(BASE_URL + "/appointments", appointment.addAppointment);

module.exports = router;

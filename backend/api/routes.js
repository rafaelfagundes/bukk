const express = require("express");
const router = express.Router();

const company = require("./components/company/companyController");
const service = require("./components/service/serviceController");
const specialist = require("./components/employee/employeeController");
const appointment = require("./components/appointment/appointmentController");
const user = require("./components/user/userController");

const BASE_URL = "/api";

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== "undefined") {
    req.token = bearerHeader.split(" ")[1];
    next(); // Next middleware
  } else {
    res.sendStatus(403); // Forbidden
  }
}

/*============================================================
Company
============================================================*/
router.get(BASE_URL + "/companies/:id", company.getSingleCompany);
router.get(BASE_URL + "/companies/css/:id", company.getCompanyCss);
router.post(BASE_URL + "/companies", verifyToken, company.getCompany);
router.post(BASE_URL + "/companies/update", verifyToken, company.updateCompany);

/*============================================================
Service
============================================================*/
router.get(
  BASE_URL + "/services/company/:companyId",
  service.getServicesByCompany
);

router.post(
  BASE_URL + "/services/company/",
  verifyToken,
  service.companyServices
);

router.post(
  BASE_URL + "/services/company/update",
  verifyToken,
  service.updateCompanyServices
);

/*============================================================
Specialist (Employee)
============================================================*/
router.get(
  BASE_URL + "/specialists/company/:companyId",
  specialist.getEmployeesByCompany
);

router.post(
  BASE_URL + "/specialists/user",
  verifyToken,
  specialist.getEmployeeByUserId
);

router.get(
  BASE_URL +
    "/specialists/schedule/:companyId/date/:date/duration/:serviceDuration",
  specialist.getSchedule
);

router.patch(
  BASE_URL + "/specialists/update",
  verifyToken,
  specialist.updateEmployee
);

/*============================================================
Appointment
============================================================*/
router.post(BASE_URL + "/appointments", appointment.addAppointment);

/*============================================================
User
============================================================*/
router.post(BASE_URL + "/users/", verifyToken, user.getUser);
router.post(BASE_URL + "/users/login", user.login);
router.post(BASE_URL + "/users/testAuth", verifyToken, user.testAuth);
router.patch(BASE_URL + "/users/update", verifyToken, user.updateUser);
router.post(
  BASE_URL + "/users/changePassword",
  verifyToken,
  user.updateUserPassword
);

module.exports = router;

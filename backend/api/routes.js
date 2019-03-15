const express = require("express");
const router = express.Router();

const company = require("./components/company/companyController");
const service = require("./components/service/serviceController");
const specialist = require("./components/employee/employeeController");
const appointment = require("./components/appointment/appointmentController");
const user = require("./components/user/userController");
const costumer = require("./components/costumer/costumerController");

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
  BASE_URL + "/services/company",
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
  BASE_URL + "/specialists/company",
  verifyToken,
  specialist.allEmployeesByCompany
);

router.post(
  BASE_URL + "/specialists/service",
  verifyToken,
  specialist.allEmployeesByService
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

router.post(
  BASE_URL + "/specialists/schedule/",
  verifyToken,
  specialist.getSchedulePost
);

router.patch(
  BASE_URL + "/specialists/update",
  verifyToken,
  specialist.updateEmployee
);

router.patch(
  BASE_URL + "/specialists/updateUserEmployee",
  verifyToken,
  specialist.updateUserEmployee
);

router.patch(
  BASE_URL + "/specialists/availability",
  verifyToken,
  specialist.updateEmployeeAvailability
);

router.post(
  BASE_URL + "/specialists/delete",
  verifyToken,
  specialist.removeEmployee
);

/*============================================================
Appointment
============================================================*/
router.post(BASE_URL + "/appointments", appointment.addAppointment);
router.post(
  BASE_URL + "/appointment",
  verifyToken,
  appointment.addAppointmentViaDashboard
);
router.post(
  BASE_URL + "/appointments/list",
  verifyToken,
  appointment.getAllAppointments
);
router.post(
  BASE_URL + "/appointments/clientlist",
  verifyToken,
  appointment.getAllClientAppointments
);
router.post(
  BASE_URL + "/appointments/get",
  verifyToken,
  appointment.getOneAppointment
);
router.get(
  BASE_URL + "/appointments/cancel/:id/:email",
  appointment.deleteAppointmentViaUrl
);
router.patch(
  BASE_URL + "/appointment/update",
  verifyToken,
  appointment.updateOne
);
router.patch(
  BASE_URL + "/appointments/update",
  verifyToken,
  appointment.updateMany
);

/*============================================================
User
============================================================*/
router.post(BASE_URL + "/users/", verifyToken, user.getUser);
router.post(BASE_URL + "/users/login", user.login);
router.post(BASE_URL + "/users/adduser", verifyToken, user.addUserByAdmin);
router.patch(BASE_URL + "/users/update", verifyToken, user.updateUser);
router.post(
  BASE_URL + "/users/changePassword",
  verifyToken,
  user.updateUserPassword
);
module.exports = router;

/*============================================================
Costumer
============================================================*/
router.post(
  BASE_URL + "/costumers/list",
  verifyToken,
  costumer.getAllCostumers
);
router.post(BASE_URL + "/costumers/save", verifyToken, costumer.saveCostumer);
router.post(
  BASE_URL + "/costumers/delete",
  verifyToken,
  costumer.deleteCostumer
);
router.post(BASE_URL + "/costumers/get", verifyToken, costumer.getCostumer);
router.post(BASE_URL + "/costumers/find", verifyToken, costumer.findCostumers);
router.post(
  BASE_URL + "/costumers/notes/get",
  verifyToken,
  costumer.getCostumerNotes
);
router.post(
  BASE_URL + "/costumers/notes/save",
  verifyToken,
  costumer.saveCostumerNotes
);

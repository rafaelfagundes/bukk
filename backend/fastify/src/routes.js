// Import our Controllers
const appointmentController = require("./components/appointment/appointmentController");
const companyController = require("./components/company/companyController");
const serviceController = require("./components/service/serviceController");
const employeeController = require("./components/employee/employeeController");

const routes = [
  /*
  ===========================================================
  Appointments
  ===========================================================
  */
  {
    method: "GET",
    url: "/api/appointments",
    handler: appointmentController.getAppointments
  },
  {
    method: "GET",
    url: "/api/appointments/:id",
    handler: appointmentController.getSingleAppointment
  },
  {
    method: "POST",
    url: "/api/appointments",
    handler: appointmentController.addAppointment
    // schema: documentation.addAppointmentSchema
  },
  {
    method: "PUT",
    url: "/api/appointments/:id",
    handler: appointmentController.updateAppointment
  },
  {
    method: "DELETE",
    url: "/api/appointments/:id",
    handler: appointmentController.deleteAppointment
  },
  /*
  ===========================================================
  Companies
  ===========================================================
  */
  {
    method: "GET",
    url: "/api/companies",
    handler: companyController.getCompanies
  },
  {
    method: "GET",
    url: "/api/companies/:id",
    handler: companyController.getSingleCompany
  },
  {
    method: "POST",
    url: "/api/companies",
    handler: companyController.addCompany
    // schema: documentation.addCompanySchema
  },
  {
    method: "PUT",
    url: "/api/companies/:id",
    handler: companyController.updateCompany
  },
  {
    method: "DELETE",
    url: "/api/companies/:id",
    handler: companyController.deleteCompany
  },
  /*
  ===========================================================
  Services
  ===========================================================
  */
  {
    method: "GET",
    url: "/api/services",
    handler: serviceController.getServices
  },
  {
    method: "GET",
    url: "/api/services/:id",
    handler: serviceController.getSingleService
  },
  {
    method: "GET",
    url: "/api/services/company/:companyId",
    handler: serviceController.getServicesByCompany
  },
  {
    method: "POST",
    url: "/api/services",
    handler: serviceController.addService
    // schema: documentation.addServiceSchema
  },
  {
    method: "PUT",
    url: "/api/services/:id",
    handler: serviceController.updateService
  },
  {
    method: "DELETE",
    url: "/api/services/:id",
    handler: serviceController.deleteService
  },
  /*
  ===========================================================
  Employees
  ===========================================================
  */
  {
    method: "GET",
    url: "/api/specialists",
    handler: employeeController.getEmployees
  },
  {
    method: "GET",
    url: "/api/specialists/:id",
    handler: employeeController.getSingleEmployee
  },
  {
    method: "GET",
    url: "/api/specialists/schedule/:id/date/:date/duration/:duration",
    handler: employeeController.getSchedule
  },
  {
    method: "GET",
    url: "/api/specialists/company/:companyId",
    handler: employeeController.getEmployeesByCompany
  },
  {
    method: "POST",
    url: "/api/specialists",
    handler: employeeController.addEmployee
    // schema: documentation.addEmployeeSchema
  },
  {
    method: "PUT",
    url: "/api/specialists/:id",
    handler: employeeController.updateEmployee
  },
  {
    method: "DELETE",
    url: "/api/specialists/:id",
    handler: employeeController.deleteEmployee
  }
];

module.exports = routes;

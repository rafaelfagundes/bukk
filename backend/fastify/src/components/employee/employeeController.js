// External Dependancies
const boom = require("boom");
const mongoose = require("mongoose");
const moment = require("moment");

// Get Data Models
const Employee = require("./Employee");
const User = require("../user/User");
const Appointment = require("../appointment/Appointment");

// Get all employees
exports.getEmployees = async (req, reply) => {
  try {
    const employees = await Employee.find();
    return employees;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get all employees by company
exports.getEmployeesByCompany = async (req, reply) => {
  try {
    const companyId = req.params.companyId;
    const employees = await User.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId("5c0edd683743257844de6e69"),
          role: "employee"
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "user",
          as: "employee"
        }
      },
      {
        $unwind: {
          path: "$employee"
        }
      },
      {
        $project: {
          _id: 0,
          firstName: 1,
          lastName: 1,
          "employee._id": 1,
          "employee.services": 1,
          "employee.title": 1,
          "employee.avatar": 1
        }
      }
    ]);
    return employees;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get single employee by ID
exports.getSingleEmployee = async (req, reply) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findById(id);
    return employee;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get an employee's schedule
exports.getSchedule = async (req, reply) => {
  console.clear();
  const id = req.params.id;
  const monthStart = moment(req.params.date + "-01");
  const monthEnd = moment(req.params.date + "-01").add(1, "month");
  const duration = req.params.duration;

  return [{ id, monthStart, monthEnd, duration }];
};

exports.getAvaialbleDates2 = async (req, reply) => {
  try {
    const id = req.params.id;
    const date = req.params.date;
    const employee = await Employee.findById(id);
    return employee;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Add a new employee
exports.addEmployee = async (req, reply) => {
  try {
    const employee = new Employee(req.body);
    return employee.save();
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Update an existing employee
exports.updateEmployee = async (req, reply) => {
  try {
    const id = req.params.id;
    const employee = req.body;
    const { ...updateData } = employee;
    const update = await Employee.findByIdAndUpdate(id, updateData, {
      new: true
    });
    return update;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Delete a employee
exports.deleteEmployee = async (req, reply) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findByIdAndRemove(id);
    return employee;
  } catch (err) {
    throw boom.boomify(err);
  }
};

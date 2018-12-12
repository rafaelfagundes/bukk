// External Dependancies
const boom = require("boom");
const mongoose = require("mongoose");
const moment = require("moment");

// Get Data Models
const Employee = require("./Employee");
const User = require("../user/User");
const Appointment = require("../appointment/Appointment");

function generateMonthSchedule(date, workingDays, workingTime, timeFrame = 30) {
  let monthStart = moment(date);
  if (monthStart.isBefore(moment())) {
    monthStart = moment({ minute: "00", second: "00" });
  }
  const monthEnd = moment(date).add(1, "month");

  let dateSet = new Set();

  let times = [];

  while (monthStart.isBefore(monthEnd)) {
    // For each working time period
    workingTime.forEach(wTime => {
      // Start period
      let _s = moment(monthStart).set({
        hour: wTime.start.split(":")[0],
        minute: wTime.start.split(":")[1],
        second: "00"
      });

      //End period
      let _e = moment(monthStart).set({
        hour: wTime.end.split(":")[0],
        minute: wTime.end.split(":")[1],
        second: "00"
      });

      // Non working day filter
      if (workingDays.indexOf(moment(monthStart).weekday()) >= 0) {
        // Non working hour filter
        if (
          moment(monthStart).isSameOrAfter(_s) &&
          moment(monthStart).isBefore(_e) &&
          moment(monthStart).isSameOrAfter(moment())
        ) {
          times.push(moment(monthStart).format("YYYY-MM-DD HH:mm"));
        }
      } else {
        dateSet.add(moment(monthStart).format("YYYY-MM-DD"));
      }
    });
    monthStart.add(timeFrame, "minute");
  }

  const dates = Array.from(dateSet);

  return {
    dates,
    times
  };
}

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
  try {
    console.clear();
    const id = req.params.id;
    const date = req.params.date;
    const duration = req.params.duration;

    // return [{ id, monthStart, monthEnd, duration }];
    return generateMonthSchedule(
      date,
      [1, 2, 3, 4, 5],
      [{ start: "8:00", end: "12:00" }, { start: "14:00", end: "18:00" }],
      duration
    );
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

// External Dependancies
const boom = require("boom");
const auth = require("../../auth");
const mongoose = require("mongoose");
const moment = require("moment");
const _ = require("lodash");

// Get Data Models
const Employee = require("./Employee");
const User = require("../user/User");
const Appointment = require("../appointment/Appointment");

function generateMonthSchedule(date, workingDays, timeFrame = 30) {
  function getWorkingHours(workingDay) {
    return _.find(workingDays, function(o) {
      return o.weekDay === workingDay;
    }).workingHours;
  }

  // If the first day
  let monthStart = moment(date);

  // If not the first day
  if (monthStart.isBefore(moment())) {
    monthStart = moment({ minute: "00", second: "00" });
  }

  // First moment of the next month
  const monthEnd = moment(date).add(1, "month");

  // Maps days to indexes
  const allWeekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  // Actually working days
  const _workingDays = [];
  workingDays.forEach(day => {
    _workingDays.push(day.weekDay);
  });

  // Excluded dates
  let dateSet = new Set();

  // Times
  let times = [];

  while (monthStart.isBefore(monthEnd)) {
    // If in working days
    if (_workingDays.indexOf(allWeekDays[monthStart.weekday()]) >= 0) {
      let _workingHours = getWorkingHours(allWeekDays[monthStart.weekday()]);
      _workingHours.forEach(hour => {
        // Start period
        let _s = moment(monthStart).set({
          hour: hour.start.split(":")[0],
          minute: hour.start.split(":")[1],
          second: "00"
        });

        //End period
        let _e = moment(monthStart).set({
          hour: hour.end.split(":")[0],
          minute: hour.end.split(":")[1],
          second: "00"
        });

        // Check if it is in time range
        if (
          moment(monthStart).isSameOrAfter(_s) &&
          moment(monthStart).isBefore(_e) &&
          moment(monthStart).isSameOrAfter(moment())
        ) {
          times.push(moment(monthStart).format("YYYY-MM-DD HH:mm"));
        }
      });
    } else {
      dateSet.add(moment(monthStart).format("YYYY-MM-DD"));
    }

    // Add X minutes
    monthStart.add(timeFrame, "minute");
  }

  // Cast to array
  const dates = Array.from(dateSet);

  return {
    dates,
    times
  };
}

function filterAlreadyUsedTimes(appointments, times) {
  appointments.forEach(app => {
    _.remove(times, function(time) {
      const s = moment(app.start);
      const e = moment(app.end);
      const t = moment(time);
      return t.isSameOrAfter(s) && t.isBefore(e);
    });
  });
}

function filterIncompatibleRange(times, duration, timeFrame = 30) {
  function isAllFound(items, array) {
    let _counter = 0;
    items.forEach(i => {
      let result = _.find(array, function(o) {
        return i === o;
      });
      if (result) _counter++;
    });
    return _counter === items.length;
  }
  const _timeSlots = duration / timeFrame;

  // console.log(isAllFound([1, 2, 3], [1, 3, 4, 5]));

  const _filteredTimes = [];

  times.forEach(t => {
    let _times = [];
    let _time = moment(t);
    for (let index = 0; index < _timeSlots; index++) {
      _times.push(moment(_time).format("YYYY-MM-DD HH:mm"));
      _time.add(timeFrame, "minute");
    }

    if (isAllFound(_times, times)) {
      _filteredTimes.push(t);
    }
  });

  return _filteredTimes;
}

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.send(employees);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get all employees by company
exports.getEmployeesByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const employees = await User.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(companyId),
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
          avatar: 1,
          "employee._id": 1,
          "employee.services": 1,
          "employee.title": 1,
          "employee.avatar": 1
        }
      }
    ]);
    res.send(employees);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get single employee by User ID
exports.getEmployeeByUserId = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Invalid token"
      });
    }
    const employee = await Employee.findOne(
      { user: token.id },
      "services workingDays title worksSince createdAt"
    );
    if (employee) {
      res.send(employee);
    } else {
      res.status(403).send({ msg: "Something went wrong" });
    }
  } catch (err) {
    res.send(boom.boomify(err));
  }
};
// Get single employee by ID
exports.getSingleEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findById(id);
    return employee;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get an employee's schedule
exports.getSchedule = async (req, res) => {
  try {
    console.clear();
    const id = req.params.companyId;
    const date = req.params.date;
    const serviceDuration = req.params.duration;

    const employee = await Employee.findOne({ _id: id });
    const appointments = await Appointment.find({ employee: id });
    let _monthSchedule = generateMonthSchedule(date, employee.workingDays);

    // Scheduled times
    filterAlreadyUsedTimes(appointments, _monthSchedule.times);

    // Impossible to book due previous booking
    _monthSchedule.times = filterIncompatibleRange(
      _monthSchedule.times,
      serviceDuration,
      30
    );

    res.send(_monthSchedule);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Add a new employee
exports.addEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    return employee.save();
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
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
exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findByIdAndRemove(id);
    return employee;
  } catch (err) {
    throw boom.boomify(err);
  }
};

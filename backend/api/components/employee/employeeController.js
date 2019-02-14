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

// Get all employees by company [GET]
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
          "employee.avatar": 1,
          "employee.enabled": 1
        }
      }
    ]);

    let _employeesResult = [];
    employees.forEach(e => {
      if (e.employee.enabled) {
        if (e.employee.services.length > 0) {
          _employeesResult.push(e);
        }
      }
    });

    res.send(_employeesResult);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get all employees by service
exports.allEmployeesByService = async (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Token inválido."
    });
  }
  try {
    const { serviceId } = req.body;
    const specialists = await User.aggregate([
      {
        $match: {
          role: "employee",
          company: new mongoose.Types.ObjectId(token.company)
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
          _id: 1,
          firstName: 1,
          lastName: 1,
          avatar: 1,
          "employee.enabled": 1,
          "employee.services": 1,
          "employee.workingDays": 1
        }
      }
    ]);

    const _specialists = [];

    specialists.forEach(s => {
      if (
        s.employee.enabled &&
        s.employee.services.length > 0 &&
        s.employee.workingDays.length > 0
      ) {
        let _found = false;
        s.employee.services.forEach(service => {
          if (String(service) === serviceId) {
            _found = true;
          }
        });

        if (_found) {
          _specialists.push(s);
        }
      }
    });

    if (_specialists.length > 0) {
      res.status(200).send(_specialists);
    } else {
      res.status(404).send({ msg: "Nenhum especialista encontrado" });
    }
  } catch (error) {
    res.status(500).send({ msg: error });
  }
};

// Get all employees by company [POST]
exports.allEmployeesByCompany = async (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Token inválido."
    });
  }

  try {
    const companyId = req.body.companyId;
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
          _id: 1,
          firstName: 1,
          lastName: 1,
          avatar: 1,
          gender: 1,
          birthday: 1,
          email: 1,
          phone: 1,
          address: 1,
          "employee._id": 1,
          "employee.services": 1,
          "employee.title": 1,
          "employee.avatar": 1,
          "employee.salesCommission": 1,
          "employee.workingDays": 1,
          "employee.salary": 1,
          "employee.enabled": 1
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
      res.status(404).send({
        msg: "O usuário precisa preencher o restante dos seus dados."
      });
    }
  } catch (err) {
    res.send(boom.boomify(err));
  }
};

// Get an employee's schedule
exports.getSchedule = async (req, res) => {
  try {
    const id = req.params.companyId;
    const date = req.params.date;
    const serviceDuration = req.params.serviceDuration;

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

// Update Employee
exports.updateEmployee = async (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Invalid token"
    });
  }
  try {
    const employee = await Employee.updateOne({ user: token.id }, req.body);
    if (employee) {
      res.status(200).send(employee);
    } else {
      res.status(404).json({
        msg: "Error: can not update employee"
      });
    }
  } catch (error) {
    res.status(404).json({
      msg: "Error: can not update employee: " + error
    });
  }
};

// Update User-Employee
exports.updateUserEmployee = async (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Invalid token"
    });
  }

  if (token.role !== "owner") {
    res.status(403).json({
      msg: "Permissão negada"
    });
  }

  try {
    const user = await User.updateOne(
      { _id: req.body.user._id },
      req.body.user
    );
    const employee = await Employee.updateOne(
      { _id: req.body.employee._id },
      req.body.employee
    );

    if (employee && user) {
      res.status(200).send({ msg: "OK" });
    } else {
      res.status(500).json({
        msg: "Error: can not update employee"
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Error: can not update employee: " + error
    });
  }
};

// Employee Enabled/Disabled
exports.updateEmployeeAvailability = async (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Invalid token"
    });
  }

  if (token.role !== "owner") {
    res.status(403).json({
      msg: "Permissão negada"
    });
  }

  try {
    const employee = await Employee.updateOne({ _id: req.body._id }, req.body);
    if (employee.ok) {
      res.status(200).send({ msg: "OK" });
    } else {
      res.status(500).send({ msg: "Impossível atualizar estado do usuário" });
    }
  } catch (error) {
    throw boom.boomify(error);
  }
};

// Remove Employee
exports.removeEmployee = async (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Invalid token"
    });
  }

  if (token.role !== "owner") {
    res.status(403).json({
      msg: "Permissão negada"
    });
  }

  const employee = await Employee.deleteOne({ _id: req.body.employeeId });
  if (employee.ok) {
    const user = await User.deleteOne({ _id: req.body.userId });
    if (user.ok) {
      res.status(200).send({ msg: "OK" });
    } else {
      res
        .status(500)
        .send({ msg: "Erro ao remover usuário. Este é um erro crítico!" });
    }
  } else {
    res.status(500).send({ msg: "Erro ao remover funcionário." });
  }
};

const auth = require("../../auth");
const shortid = require("shortid");
const moment = require("moment");

const Appointment = require("../appointment/Appointment");
const Costumer = require("../costumer/Costumer");
const Service = require("../service/Service");
const Employee = require("../employee/Employee");
const User = require("../user/User");

exports.getOverview = async (req, res) => {
  console.time("stats");
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Token inválido."
    });
  }
  const { company, role } = token;

  // Today
  const todayStart = moment().startOf("day");
  const todayEnd = moment().endOf("day");

  const today = await Appointment.find({
    start: {
      $gte: todayStart.toDate(),
      $lte: todayEnd.toDate()
    }
  });

  let _today = {
    count: 0,
    value: 0
  };

  today.forEach(t => {
    _today.count++;
    _today.value += t.value;
  });

  // Week
  const weekStart = moment().startOf("week");
  const weekEnd = moment().endOf("week");

  const week = await Appointment.find({
    start: {
      $gte: weekStart.toDate(),
      $lte: weekEnd.toDate()
    }
  });

  let _week = {
    count: 0,
    value: 0
  };

  week.forEach(t => {
    _week.count++;
    _week.value += t.value;
  });

  // Month
  const monthStart = moment().startOf("month");
  const monthEnd = moment().endOf("month");

  const month = await Appointment.find({
    start: {
      $gte: monthStart.toDate(),
      $lte: monthEnd.toDate()
    }
  });

  let _month = {
    count: 0,
    value: 0
  };

  let _monthPayed = {
    count: 0,
    value: 0
  };

  month.forEach(t => {
    _month.count++;
    _month.value += t.value;

    if (t.status === "payed") {
      _monthPayed.count++;
      _monthPayed.value += t.value;
    }
  });

  const appointments = await Appointment.find({ company })
    .limit(6)
    .sort({ start: "asc" });

  let _appointments = [];
  for (const app of appointments) {
    const _costumer = await Costumer.findById(app.costumer, "fullName");
    const _service = await Service.findById(app.service, "desc");
    const _employee = await Employee.findById(app.employee, "user");
    const _user = await User.findById(_employee.user, "firstName lastName");

    _appointments.push({
      id: app._id,
      service: _service.desc,
      specialist: `${_user.firstName} ${_user.lastName}`,
      client: _costumer.fullName,
      start: app.start,
      end: app.end
    });
  }

  const clients = await Costumer.find(
    { company },
    "fullName email phone createdAt"
  )
    .limit(6)
    .sort({ createdAt: "desc" });

  console.timeEnd("stats");
  if (appointments && clients) {
    res.status(200).send({
      msg: "OK",
      appointments: _appointments,
      clients,
      today: _today,
      week: _week,
      month: _month,
      monthPayed: _monthPayed
    });
  } else {
    res.status(500).send({ msg: "Não foi possível retornar as estatísticas." });
  }
};

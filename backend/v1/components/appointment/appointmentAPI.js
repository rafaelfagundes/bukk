const express = require("express");
const router = express.Router();
const _ = require("lodash");

const moment = require("moment");

const User = require("../user/User");
const Company = require("../company/Company");
const Service = require("../service/Service");

const mongoose = require("mongoose");

const Appointment = require("../appointment/Appointment");
const Costumer = require("../costumer/Costumer");

function getWeekday(number) {
  const _weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return _weekdays[number];
}

function generateTimeTable(times, minTimeFrame = 30) {
  let _timeTable = [];

  times.forEach(time => {
    let _s = moment().set({
      hour: time.start.split(":")[0],
      minute: time.start.split(":")[1],
      second: "00"
    });
    let _e = moment().set({
      hour: time.end.split(":")[0],
      minute: time.end.split(":")[1],
      second: "00"
    });
    while (_s.isBefore(_e)) {
      if (_s.format("HH:mm") !== _e.format("HH:mm")) {
        _timeTable.push(moment(_s).format("HH:mm"));
      }
      _s.add(minTimeFrame, "minutes");
    }
  });

  return _timeTable;
}

router.get("/appointment/:companyId", (req, res) => {
  Company.findById({ _id: req.params.companyId }, (err, company) => {
    if (err) {
      res.status(500).send({ error: err });
    }
    if (!company) res.status(404).send({ msg: "Empresa não encontrada" });
    else {
      let _appData = {
        business: {
          logo: company.logo,
          address: company.address,
          tradingName: company.tradingName,
          companyNickname: company.companyNickname,
          website: company.website,
          email: company.email,
          social: company.social,
          workingDays: company.workingDays,
          phone: company.phone,
          paymentOptions: company.paymentOptions
        },
        services: [],
        specialists: []
      };

      Service.find({ company: company._id }, (err, services) => {
        if (err) {
          res.status(500).send({ error: err });
        }
        services.forEach(service => {
          if (service.display) {
            let _service = {
              id: service._id,
              desc: service.desc,
              value: service.value,
              duration: service.duration
            };
            _appData.services.push(_service);
          }
        });

        User.aggregate(
          [
            { $match: { role: "employee" } },
            {
              $match: {
                company: new mongoose.Types.ObjectId(req.params.companyId)
              }
            },
            {
              $lookup: {
                from: "employees",
                localField: "_id",
                foreignField: "user",
                as: "employee"
              }
            }
          ],
          (err, users) => {
            if (err) {
              res.status(500).send({ error: err });
            }
            users.forEach(user => {
              let _specialist = {};

              _specialist.firstName = user.firstName;
              _specialist.lastName = user.lastName;

              const _employee = user.employee[0];
              _specialist.image = _employee.avatar;
              _specialist.desc = _employee.title;
              _specialist.services = _employee.services;
              _specialist.id = _employee._id;

              _appData.specialists.push(_specialist);
            });
            res.status(200).send(_appData);
          }
        );
      });
    }
  });
});

router.get("/appointment/dates/:id/:date", (req, res) => {
  try {
    if (!moment(req.params.date).isValid("YYYY-MM")) {
      res.status(500).json([]);
      return false;
    }
  } catch (error) {
    res.status(500).json([]);
    return false;
  }

  const _dateFromParam = moment(req.params.date + "-01", "YYYY-MM");

  // Month is in the past
  if (moment().isAfter(_dateFromParam, "month")) {
    res.status(500).json([]);
    return false;
  }

  const settings = {
    workingDays: [1, 2, 3, 4, 5] // 0 = domingo
  };

  function getDaysArrayByMonth() {
    const _date = moment(req.params.date, "YYYY-MM");
    var _daysInMonth = _date.daysInMonth();

    var arrDays = [];

    while (_daysInMonth) {
      var current = moment(req.params.date, "YYYY-MM").date(_daysInMonth);
      arrDays.push(current);
      _daysInMonth--;
    }

    return arrDays;
  }

  var schedule = getDaysArrayByMonth();
  var _unavailableDays = [];
  schedule.forEach(function(item) {
    if (_.indexOf(settings.workingDays, item.weekday()) < 0) {
      _unavailableDays.push(item.toDate());
    }
  });

  res.status(200).json(_unavailableDays);
});

router.get("/appointment/date/:id/:date", (req, res) => {
  let _dateReq = moment(req.params.date);
  const _employeeId = req.params.id;
  let _excludeDates = [];

  Appointment.aggregate(
    [
      {
        $match: {
          employee: mongoose.Types.ObjectId(_employeeId)
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employee"
        }
      }
    ],
    (err, appointments) => {
      let _timeTable;
      appointments.forEach(item => {
        const _employee = item.employee[0];
        let _start = moment(item.start);
        let _end = moment(item.end);

        let _workingHours = _.find(_employee.workingDays, function(e) {
          return e.weekDay === getWeekday(_dateReq.weekday());
        });

        // console.log(_start.format("YYYY-MM-DD"));

        if (_workingHours) {
          if (_dateReq.format("YYYY-MM-DD") === _start.format("YYYY-MM-DD")) {
            _timeTable = generateTimeTable(_workingHours.workingHours, 30);

            _.remove(_timeTable, t => {
              let _time = moment(_dateReq.format("YYYY-MM-DD") + " " + t);
              const _t = moment(_time.format("YYYY-MM-DD HH:mm"));
              const _s = moment(_start.format("YYYY-MM-DD HH:mm"));
              const _e = moment(_end.format("YYYY-MM-DD HH:mm"));

              return _t.isSameOrAfter(_s) && _t.isBefore(_e);
            });
          } else {
            _timeTable = generateTimeTable(_workingHours.workingHours, 30);
            console.log("outro dia");
          }

          // Remove times in today past
          _.remove(_timeTable, t => {
            let _time = moment(_dateReq.format("YYYY-MM-DD") + " " + t);
            const _t = moment(_time.format("YYYY-MM-DD HH:mm"));
            return _t.isBefore(moment());
          });
        }
      });

      res.status(200).send(_timeTable);
    }
  );
});

router.post("/appointment/", (req, res) => {
  console.log(req.body);
  const _client = req.body.client; // Costumer
  const _services = req.body.services;

  let _costumer = {
    firstName: _client.firstName,
    lastName: _client.lastName,
    email: _client.email,
    gender: _client.gender,
    phone: [{ number: _client.phone, whatsapp: _client.whatsapp }],
    company: req.body.companyId
  };

  Costumer.create(_costumer, (err, costumer) => {
    if (err) res.status(500).json({ msg: "Erro ao criar novo agendamento." });
    else {
      let _appointments = [];
      _services.forEach(_service => {
        let _appointment = {
          costumer: costumer._id, // criado antes
          employee: _service.specialistId,
          company: req.body.companyId,
          service: _service.serviceId,
          start: _service.start,
          end: _service.end,
          status: "created",
          notes: _client.obs
        };

        _appointments.push(_appointment);
      });

      Appointment.create(_appointments, (err, appointments) => {
        if (err)
          res.status(500).json({ msg: "Erro ao criar novo agendamento." });
        else {
          console.log(appointments);
          const _return = {
            status: "confirmed",
            msg: "Agendamento concluído com sucesso",
            client: _client,
            services: _services
          };
          res.status(200).json(_return);
        }
      });
    }
  });
});

module.exports = router;

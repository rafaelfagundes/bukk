const express = require("express");
const router = express.Router();
const _ = require("lodash");
const QRCode = require("qrcode");
const ical = require("ical-generator");
const moment = require("moment");

const User = require("../user/User");
const Company = require("../company/Company");
const Service = require("../service/Service");
const Employee = require("../employee/Employee");

const Appointment = require("../appointment/Appointment");

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

        User.find({ company: company.id, role: "employee" }, (err, users) => {
          if (err) {
            res.status(500).send({ error: err });
          }
          users.forEach(user => {
            let _specialist = {};
            _specialist.id = user._id;
            _specialist.firstName = user.firstName;
            _specialist.lastName = user.lastName;

            Employee.findOne({ user: user._id }, (err, employee) => {
              if (err) {
                res.status(500).send({ error: err });
              }
              let _simplifiedServices = [];
              services.forEach(service => {
                if (service.display) {
                  _simplifiedServices.push({
                    id: service._id,
                    value: service.value,
                    duration: service.duration
                  });
                }
              });

              employee.services = _simplifiedServices;
              _specialist.image = employee.avatar;
              _specialist.desc = employee.title;
              _specialist.services = employee.services;

              _appData.specialists.push(_specialist);
              res.status(200).send(_appData);
            });
          });
        });
      });
    }
  });
});

router.get("/appointment/dates/:id/:date", (req, res) => {
  // TODO: passar para chamada no banco

  const settings = {
    workingDays: [1, 2, 3, 4, 5] // 0 = domingo
  };

  function getDaysArrayByMonth() {
    var daysInMonth = moment(req.params.date, "YYYY-MM").daysInMonth();

    var arrDays = [];

    while (daysInMonth) {
      var current = moment(req.params.date, "YYYY-MM").date(daysInMonth);
      arrDays.push(current);
      daysInMonth--;
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
  const dates = [
    {
      date: moment().format("YYYY-MM-DD"),
      times: [
        "8:00",
        "8:30",
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "15:00",
        "15:30",
        "17:00",
        "17:30"
      ]
    },
    {
      date: moment()
        .add(1, "days")
        .format("YYYY-MM-DD"),
      times: ["8:00", "8:30", "9:00", "9:30"]
    },

    {
      date: moment()
        .add(2, "days")
        .format("YYYY-MM-DD"),
      times: [
        "8:00",
        "8:30",
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "15:00",
        "15:30",
        "17:00",
        "17:30"
      ]
    },
    {
      date: moment()
        .add(3, "days")
        .format("YYYY-MM-DD"),
      times: ["15:30"]
    },
    {
      date: moment()
        .add(4, "days")
        .format("YYYY-MM-DD"),
      times: ["9:00", "15:00", "16:00", "17:00"]
    },
    {
      date: moment()
        .add(5, "days")
        .format("YYYY-MM-DD"),
      times: ["9:00", "9:30", "16:00", "17:00"]
    },
    {
      date: moment()
        .add(6, "days")
        .format("YYYY-MM-DD"),
      times: ["9:00", "9:30", "15:00", "16:00"]
    },
    {
      date: moment()
        .add(7, "days")
        .format("YYYY-MM-DD"),
      times: ["9:00", "9:30", "15:00", "17:00"]
    }
  ];

  const date = _.find(dates, function(o) {
    return o.date === req.params.date;
  });
  if (date) {
    res.status(200).send(date);
  } else {
    res.status(404).send({ error: "Datas indisponível" });
  }
});

router.post("/appointment/", (req, res) => {
  console.log(req.body);
  const _client = req.body.client; // Costumer
  const _services = req.body.services;

  // console.log(_client);
  // console.log(_services);

  _services.forEach(_service => {
    const _hour = _service.dateAndTime.time.split(":")[0];
    const _minute = _service.dateAndTime.time.split(":")[1];

    let _start = moment(_service.date);
    _start.set({ hour: _hour, minute: _minute });

    const _end = moment(_start)
      .add(_service.duration, "minutes")
      .toDate();
    _start = _start.toDate();

    let _appointment = {
      costumer: "", // criado antes
      employee: _service.specialistId,
      company: req.body.companyId,
      service: _service.serviceId,
      start: _start,
      end: _end,
      status: "created",
      notes: _client.obs
    };

    console.log(_appointment);
  });
});

module.exports = router;

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
              console.log(user);

              let _specialist = {};
              _specialist.id = user._id;
              _specialist.firstName = user.firstName;
              _specialist.lastName = user.lastName;

              const _employee = user.employee[0];
              _specialist.image = _employee.avatar;
              _specialist.desc = _employee.title;
              _specialist.services = _employee.services;

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

  let _costumer = {
    firstName: _client.firstName,
    lastName: _client.lastName,
    email: _client.email,
    gender: _client.gender,
    phone: [{ number: _client.phone, whatsapp: _client.whatsapp }],
    company: req.body.companyId
  };

  console.log(_costumer);

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
            confirmationId: appointments[0].id,
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

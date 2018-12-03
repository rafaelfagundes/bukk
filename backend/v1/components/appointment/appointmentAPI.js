const express = require("express");
const router = express.Router();
const faker = require("faker/locale/pt_BR");
const _ = require("lodash");
const QRCode = require("qrcode");
const ical = require("ical-generator");
const cal = ical();
const moment = require("moment");
const keys = require("../../config/keys");

const User = require("../user/User");
const Company = require("../company/Company");
const Service = require("../service/Service");
const Employee = require("../employee/Employee");

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
  console.log(
    moment()
      .add(1, "days")
      .format("YYYY-MM-DD")
  );

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
  let _event = ical({
    domain: "bukk.com.br",
    prodId: "//bukk.com.br//bukk//PT",
    events: [
      {
        start: moment(),
        end: moment().add(1, "hour"),

        summary: "Corte de cabelo Masculino",
        alarms: [
          { type: "audio", trigger: 24 * 60 * 60 },
          { type: "audio", trigger: 48 * 60 * 60 }
        ],
        organizer: {
          name: "Johnny Cash",
          email: "jcash@gmail.com"
        },
        location:
          "Rua Frederico Ozanan, 150, Guarda-Mor, São João del Rei, MG, Brasil"
      }
    ]
  }).toString();

  QRCode.toDataURL(_event)
    .then(_qrcode => {
      let response = {
        status: "confirmed",
        msg: "Agendamento concluído com sucesso",
        confirmationId: "conf00001",
        client: req.body.client,
        services: req.body.services,
        qrcode: _qrcode
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const faker = require("faker/locale/pt_BR");
const _ = require("lodash");

const keys = require("../../config/keys");

router.get("/appointment/", (req, res) => {
  const appfake = {
    business: {
      logo:
        "https://res.cloudinary.com/bukkapp/image/upload/v1542735688/Bukk/Assets/logo.png",
      startTime: 8,
      endTime: 18,
      minTimeFrame: 15
    },
    services: [
      {
        id: "service001",
        desc: "Corte de cabelo masculino",
        value: 35.9,
        duration: 60,
        products: [],
        display: true,
        company: "5bf317fba01cdd25993d54f3",
        specialists: ["spec001", "spec002", "spec003", "spec004", "spec005"]
      },

      {
        id: "service002",
        desc: "Corte de cabelo feminino",
        value: 75.9,
        duration: 90,
        products: [],
        display: true,
        company: "5bf317fba01cdd25993d54f3",
        specialists: ["spec001", "spec004", "spec005"]
      },

      {
        id: "service003",
        desc: "Alisamento feminino",
        value: 45.9,
        duration: 60,
        products: [],
        display: true,
        company: "5bf317fba01cdd25993d54f3",
        specialists: ["spec002", "spec003", "spec005"]
      }
    ],
    specialists: [
      {
        id: "spec001",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        image:
          "http://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70 + 1),
        desc: faker.name.jobTitle()
      },
      {
        id: "spec002",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        image:
          "http://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70 + 1),
        desc: faker.name.jobTitle()
      },
      {
        id: "spec003",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        image:
          "http://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70 + 1),
        desc: faker.name.jobTitle()
      },
      {
        id: "spec004",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        image:
          "http://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70 + 1),
        desc: faker.name.jobTitle()
      },
      {
        id: "spec005",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        image:
          "http://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70 + 1),
        desc: faker.name.jobTitle()
      }
    ]
  };

  res.status(200).send(appfake);
});

router.get("/appointment/dates/:id/:date", (req, res) => {
  console.log(req.params.date);
  const dates = [
    {
      date: "2018-11-22",
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
      date: "2018-11-23",
      times: ["8:00", "8:30", "9:00", "9:30"]
    },

    {
      date: "2018-11-26",
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
      date: "2018-11-27",
      times: ["15:30"]
    },
    {
      date: "2018-11-28",
      times: ["9:00", "15:00", "16:00", "17:00"]
    },
    {
      date: "2018-11-29",
      times: ["9:00", "9:30", "16:00", "17:00"]
    },
    {
      date: "2018-11-30",
      times: ["9:00", "9:30", "15:00", "16:00"]
    },
    {
      date: "2018-12-03",
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

module.exports = router;

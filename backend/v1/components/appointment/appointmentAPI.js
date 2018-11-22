const express = require("express");
const router = express.Router();
const faker = require("faker/locale/pt_BR");

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

router.get("/appointment/dates/:id", (req, res) => {
  console.log(req.params.id);

  res.status(200).send("ok");
});

module.exports = router;

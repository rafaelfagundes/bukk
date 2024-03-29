const _ = require("lodash");
const moment = require("moment");
const config = require("../config/config");
const mongoose = require("mongoose");
const faker = require("faker");
faker.locale = "pt_BR";

const User = require("../components/user/User");
const Company = require("../components/company/Company");
const Employee = require("../components/employee/Employee");
const Service = require("../components/service/Service");
const Costumer = require("../components/costumer/Costumer");
const Appointment = require("../components/appointment/Appointment");

// mongoose setup
mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("✅  MongoDB connected"))
  .catch(error => console.log(`⛔  ${error}`));

const clearCollections = () => {
  Company.collection.deleteMany({});
  User.collection.deleteMany({});
  Employee.collection.deleteMany({});
  Service.collection.deleteMany({});
  Costumer.collection.deleteMany({});
  Appointment.collection.deleteMany({});
};

const createCompany = () => {
  const company = {
    companyName: "RF Sistemas Web Ltda.",
    tradingName: "Bukk Agendador",
    companyNickname: "Bukk",
    cpfCnpj: "45441339000161",
    businessType: "J",
    logo:
      "https://res.cloudinary.com/bukkapp/image/upload/v1542735688/Bukk/Assets/logo.png",
    address: {
      street: "Rua Frederico Ozanan",
      number: "150",
      neighborhood: "Guarda-Mor",
      city: "São João del Rei",
      state: "Minas Gerais",
      country: "Brasil",
      postalCode: "36309012",
      geolocation: {
        lat: "-21.1394739",
        lng: "-44.2649491"
      }
    },
    website: "http://www.bukk.com.br",
    email: "contato@bukk.com.br",
    social: [
      {
        socialNetwork: "Instagram",
        socialId: "@bukk"
      },
      {
        socialNetwork: "Twitter",
        socialId: "@bukk"
      }
    ],
    workingDays: [
      {
        weekDay: "mon",
        workingHours: [
          { start: "08:00", end: "12:00" },
          { start: "14:00", end: "18:00" }
        ]
      },
      {
        weekDay: "tue",
        workingHours: [
          { start: "08:00", end: "12:00" },
          { start: "14:00", end: "18:00" }
        ]
      },
      {
        weekDay: "wed",
        workingHours: [
          { start: "08:00", end: "12:00" },
          { start: "14:00", end: "18:00" }
        ]
      },
      {
        weekDay: "thu",
        workingHours: [
          { start: "08:00", end: "12:00" },
          { start: "14:00", end: "18:00" }
        ]
      },
      {
        weekDay: "fri",
        workingHours: [
          { start: "08:00", end: "12:00" },
          { start: "14:00", end: "18:00" }
        ]
      }
    ],
    phone: [
      {
        number: "3233719643",
        phoneType: "landline",
        whatsAppEnabled: false
      },
      {
        number: "32991267913",
        phoneType: "cellphone",
        whatsAppEnabled: true
      }
    ],
    paymentOptions: [],
    settings: {
      appointment: {
        rules: [
          "Favor chegar com 30 minutos de antecedência",
          "Não aceitamos cheques",
          "O preço pode variar em caso de mudança nos produtos e quantidades",
          "Dividimos em até 3x sem juros"
        ]
      }
    }
  };

  Company.create(company, (err, company) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        "Company [" + company.companyNickname + " " + company.id + "] created"
      );
      createUser(company);
      createServices(company);
      createEmployeeUser(company);
      createEmployeeUser(company);
      createEmployeeUser(company);
    }
  });
};

const createServices = company => {
  const services = [
    {
      desc: "Corte de cabelo masculino",
      value: 35.89,
      duration: 60,
      products: [],
      display: true,
      company: company.id
    },
    {
      desc: "Corte de cabelo feminino",
      value: 60.0,
      duration: 90,
      products: [],
      display: true,
      company: company.id
    },
    {
      desc: "Alisamento feminino",
      value: 65.0,
      duration: 90,
      products: [],
      display: true,
      company: company.id
    },
    {
      desc: "Luzes",
      value: 40.0,
      duration: 60,
      products: [],
      display: true,
      company: company.id
    }
  ];

  services.forEach(item => {
    Service.create(item, (err, service) => {
      if (err) {
        console.error(err);
      } else {
        console.log(
          "Service [" + service.desc + " " + service.id + "] created"
        );
      }
    });
  });
};

const createUser = company => {
  const user = {
    firstName: "Rafael",
    lastName: "Fagundes",
    username: "rafaelfagundes",
    gender: "M",
    avatar:
      "https://res.cloudinary.com/bukkapp/image/upload/v1547090194/Bukk/Assets/User/007-avatar-6.png",
    birthday: moment()
      .set({ year: 1986, month: 10, date: 18 })
      .toDate(),
    email: "rafaelcflima@gmail.com",
    phone: "32991267913",
    password: "123456",
    role: "owner",
    address: {
      street: "Rua Frederico Ozanan",
      number: 150,
      neighborhood: "Guarda-Mor",
      city: "São João del Rei",
      state: "Minas Gerais",
      country: "Brasil",
      postalCode: 36309012,
      geolocation: {
        lat: "-21.1394739",
        lng: "-44.2649491"
      }
    },
    company: company.id
  };

  User.create(user, (err, user) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        "Admin user [" + user.firstName + " " + user.id + "] created"
      );
    }
  });
};

const createEmployee = user => {
  const employee = {
    user: user.id,
    workingDays: [
      {
        weekDay: "mon",
        workingHours: [
          { start: "08:00", end: "12:00" },
          { start: "14:00", end: "18:00" }
        ]
      },
      {
        weekDay: "tue",
        workingHours: [
          { start: "08:00", end: "12:00" },
          { start: "14:00", end: "18:00" }
        ]
      },
      {
        weekDay: "wed",
        workingHours: [
          { start: "08:00", end: "12:00" },
          { start: "14:00", end: "18:00" }
        ]
      },
      {
        weekDay: "thu",
        workingHours: [
          { start: "08:00", end: "12:00" },
          { start: "14:00", end: "18:00" }
        ]
      },
      {
        weekDay: "fri",
        workingHours: [
          { start: "08:00", end: "12:00" },
          { start: "14:00", end: "18:00" }
        ]
      }
    ],
    title: faker.name.jobTitle(),
    salesCommission: 30,
    worksSince: faker.date.past(),
    salary: 3600,
    services: []
  };

  Employee.create(employee, (err, employee) => {
    if (err) {
      console.error(err);
    } else {
      Service.find({}, (err, services) => {
        let _services = [];

        services.forEach(item => {
          _services.push(item.id);
        });

        Employee.findOneAndUpdate(
          { _id: employee.id },
          { services: _services },
          { useFindAndModify: false, upsert: false },
          (err, employee) => {
            if (err) console.error(err);
            else {
              employee.user = user;
              console.log(
                "Employee [" +
                  employee.user.firstName +
                  " " +
                  employee.id +
                  "] created"
              );
            }
          }
        );
      });
    }
  });
};

const createEmployeeUser = company => {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    gender: "F",
    birthday: faker.date.past(),
    email: faker.internet.email(),
    phone: "32991267913",
    password: "123456",
    role: "employee",
    address: {
      street: faker.address.streetName(),
      number: faker.random.number({ min: 80, max: 3000 }),
      neighborhood: "Guarda-Mor",
      city: faker.address.city(),
      state: faker.address.state(),
      country: faker.address.country(),
      postalCode: 36309012,
      geolocation: {
        lat: faker.address.latitude(),
        lng: faker.address.longitude()
      }
    },
    company: company.id,
    avatar: faker.image.avatar()
  };

  User.create(user, (err, user) => {
    if (err) {
      console.error(err);
    } else {
      console.log("User [" + user.firstName + " " + user.id + "] created");
      createEmployee(user);
    }
  });
};

const start = () => {
  createCompany();
};

const main = () => {
  clearCollections();
  start();
};

main();

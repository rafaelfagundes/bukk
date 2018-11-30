const _ = require("lodash");
const moment = require("moment");
const keys = require("../config/keys");
const mongoose = require("mongoose");

const User = require("../components/user/User");
const Company = require("../components/company/Company");
const Employee = require("../components/employee/Employee");
const Service = require("../components/service/Service");

// mongoose setup
mongoose.Promise = global.Promise;
mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("✅  MongoDB connected"))
  .catch(error => console.log(`⛔  ${error}`));

const clearCollections = () => {
  Company.collection.deleteMany({});
  User.collection.deleteMany({});
  Employee.collection.deleteMany({});
  Service.collection.deleteMany({});
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
    website: "http://www.rafaelf.com.br",
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
    paymentOptions: [
      {
        paymentId: "visa",
        paymentType: "credit card",
        name: "Visa",
        icon:
          "https://res.cloudinary.com/bukkapp/image/upload/v1543528600/Bukk/Assets/Payment%20Types/visa.png"
      },
      {
        paymentId: "mastercard",
        paymentType: "credit card",
        name: "MasterCard",
        icon:
          "https://res.cloudinary.com/bukkapp/image/upload/v1543528600/Bukk/Assets/Payment%20Types/mastercard.png"
      },
      {
        paymentId: "amex",
        paymentType: "credit card",
        name: "American Express",
        icon:
          "https://res.cloudinary.com/bukkapp/image/upload/v1543528599/Bukk/Assets/Payment%20Types/amex.png"
      },
      {
        paymentId: "money",
        paymentType: "cash",
        name: "Dinheiro em espécie",
        icon:
          "https://res.cloudinary.com/bukkapp/image/upload/v1543529964/Bukk/Assets/Payment%20Types/cash.png"
      }
    ]
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
      value: 35.89,
      duration: 90,
      products: [],
      display: true,
      company: company.id
    },
    {
      desc: "Alisamento feminino",
      value: 35.89,
      duration: 90,
      products: [],
      display: true,
      company: company.id
    },
    {
      desc: "Luzes",
      value: 35.89,
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
    birthday: moment()
      .set({ year: 1986, month: 10, date: 18 })
      .toDate(),
    email: "rafaelcflima@gmail.com",
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
    title: "Hair Stylist",
    salesCommission: 30,
    worksSince: moment().set({ year: 2016, month: 5, date: 15 }),
    salary: 3600,
    services: [],
    avatar: "http://i.pravatar.cc/150?img=1"
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
    firstName: "Heliete",
    lastName: "Castro",
    username: "helietecastro",
    gender: "F",
    birthday: moment()
      .set({ year: 1960, month: 11, date: 22 })
      .toDate(),
    email: "helietedecastro@gmail.com",
    password: "123456",
    role: "employee",
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

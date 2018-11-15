//During the test the env variable is set to test
process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const keys = require("../../config/keys");
mongoose.Promise = global.Promise;

const faker = require("faker/locale/pt_BR");
const chai = require("chai"),
  expect = chai.expect,
  should = chai.should();
const Company = require("../../components/company/Company");
const User = require("../../components/user/User");

describe("New user registration", function() {
  before(function(done) {
    mongoose
      .connect(
        keys.mongoURI,
        { useNewUrlParser: true }
      )
      .then(function() {
        console.log("✅  MongoDB connected");
        done();
      })
      .catch(function(error) {
        console.log(`⛔  ${error}`);
        done();
      });
    mongoose.connection.dropCollection("companies");
    mongoose.connection.dropCollection("users");
  });

  it("should create a new company and user", function(done) {
    const company = {
      companyName: "Acme Systems Ltda",
      tradingName: "Acme Sistemas",
      companyNickname: "Acme",
      businessType: "j",
      cpfCnpj: "31.534.431/0001-61",
      address: {
        street: faker.address.streetName(),
        number: Number(faker.random.number(3000)),
        neighborhood: "Guarda-Mor",
        city: faker.address.city(),
        state: faker.address.state(),
        country: "Brasil",
        postalCode: faker.address.zipCode()
      },
      website: faker.internet.url(),
      social: [
        {
          socialNetwork: "Instagram",
          socialId: "@acme"
        },
        {
          socialNetwork: "Twitter",
          socialId: "@acme"
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
          number: faker.phone.phoneNumber(),
          phoneType: "cellphone",
          whatsAppEnabled: true
        },
        {
          number: faker.phone.phoneNumber(),
          phoneType: "landline",
          whatsAppEnabled: false
        }
      ],
      paymentOptions: [
        {
          paymentType: "cash",
          paymentDesc: "Dinheiro"
        },
        {
          paymentType: "credit card",
          paymentDesc: "Visa"
        },
        {
          paymentType: "credit card",
          paymentDesc: "Master Card"
        },
        {
          paymentType: "boleto",
          paymentDesc: "Boleto bancário"
        }
      ]
    };

    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      role: "owner",
      gender: "M",
      birthday: faker.date.past(),
      address: {
        street: faker.address.streetName(),
        number: Number(faker.random.number(3000)),
        neighborhood: "Guarda-Mor",
        city: faker.address.city(),
        state: faker.address.state(),
        country: "Brasil",
        postalCode: faker.address.zipCode()
      }
    };

    Company.create(company)
      .then(function(cmp) {
        cmp.should.be.a("object");
        user.company = cmp._id;
        User.create(user)
          .then(function(usr) {
            usr.should.be.a("object");
            usr.company.should.be.eql(cmp._id);
            done();
          })
          .catch(function(err) {
            done(new Error(err));
          });
      })
      .catch(function(err) {
        done(new Error(err));
      });
  });

  //After all tests are finished drop database and close connection
  after(function(done) {
    mongoose.connection.close(done);
  });
});

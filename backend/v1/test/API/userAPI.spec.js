//During the test the env variable is set to test
process.env.NODE_ENV = "test";

const faker = require("faker/locale/pt_BR");

const mongoose = require("mongoose");

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

const User = require("../../components/user/User");

const server = require("../../server");

chai.use(chaiHttp);

const user = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: "123456",
  passwordConfirmation: "123456",
  role: "owner"
};

const company = {};

describe("User API", () => {
  beforeEach(done => {
    //Before each test we empty the database
    User.deleteMany({}, err => {
      done();
    });
  });

  describe("/POST User", done => {
    it("should create a new user", done => {
      chai
        .request(server)
        .post("/api/v1/user/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("/GET User", done => {
    it("should get an user by id", done => {
      User.create(user)
        .then(user => {
          chai
            .request(server)
            .get("/api/v1/user/" + user.id)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              done();
            });
        })
        .catch(err => {
          console.error(err);
        });
    });
  });
});

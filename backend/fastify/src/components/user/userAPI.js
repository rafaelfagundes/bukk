const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const User = require("./User");

const userValidation = require("./userValidation");
const userLoginValidation = require("./userLoginValidation");

// @route GET api/v1/user/all
// @desc Get all users
// @access Private
router.get("/user/all", (req, res) => {
  User.find({}).then(users => {
    res.send(users);
  });
});

// @route GET api/v1/user/:id
// @desc Get all users
// @access Private
router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).then(user => {
    if (user) {
      res.status(200);
      res.send(user);
    } else {
      res.status(404);
      res.send({ error: "Usuário não encontrado" });
    }
  });
});

// @route POST api/v1/user/register
// @desc Register an user
// @access Public
router.post("/user/register", (req, res) => {
  const { errors, isValid } = userValidation(req.body);

  if (!isValid) {
    res.status(400); // BAD REQUEST
    return res.send({ errors });
  }

  User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  }).then(user => {
    if (user) {
      errors.user = "O usuário já está cadastrado";

      res.status(409); // CONFLICT
      res.send(errors);
    } else {
      let newUser = req.body;
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw new err();
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw new err();
          newUser.password = hash;
          User.create(newUser).then(user => {
            res.status(200); // OK
            res.send(user);
          });
        });
      });
    }
  });
});

// @route POST api/v1/user/login
// @desc Login user / Returning JWT Token
// @access Public
router.post("/user/login", (req, res) => {
  const { errors, isValid } = userLoginValidation(req.body);

  if (!isValid) {
    res.status(400); // BAD REQUEST
    return res.send({ errors });
  }

  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400); // BAD REQUEST
    res.send({ msg: "Usuário e/ou senha não foram preenchidos" });
  } else {
    User.findOne({
      $or: [{ email: req.body.username }, { username: req.body.username }]
    }).then(user => {
      if (!user) {
        errors.user = "Usuário não cadastrado";
        res.status(404); // NOT FOUND
        res.send(errors);
      } else {
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            const payload = {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              email: user.email
            };

            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 605000 },
              (err, token) => {
                if (err) throw "Impossible to create token";
                else {
                  res.status(200);
                  res.send({ token: "Bearer " + token });
                }
              }
            );
          } else {
            errors.password = "Senha incorreta";
            res.status(400); // BAD REQUEST
            res.send(errors);
          }
        });
      }
    });
  }
});

// @route PUT api/v1/user
// @desc Update specific user
// @access Public
router.put("/user/:id", (req, res) => {
  User.updateOne({ _id: req.params.id }, req.body).then(result => {
    res.send(result);
  });
});

// @route PUT api/v1/user
// @desc Delete specific user
// @access Private
router.delete("/user/:id", (req, res) => {
  console.log(req.params.id);
  User.deleteOne({ _id: req.params.id }).then(result => {
    res.send(result);
  });
});

// @route GET api/v1/user/current
// @desc Retrieve current user
// @access Private
router.get(
  "/user/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

module.exports = router;

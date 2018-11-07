const express = require("express");
const router = express.Router();
const User = require("./user");

// @route GET api/v1/users
// @desc Get all users
// @access Private
router.get("/users", (req, res) => {
  User.find({}).then(users => {
    res.send(users);
  });
});

// @route POST api/v1/users
// @desc Get all users
// @access Public
router.post("/users", (req, res) => {
  User.create(req.body).then(user => {
    res.send(user);
  });
});

// @route PUT api/v1/users
// @desc Update specific user
// @access Public
router.put("/users/:id", (req, res) => {
  User.updateOne({ _id: req.params.id }, req.body).then(result => {
    res.send(result);
  });
});

// @route PUT api/v1/users
// @desc Delete specific user
// @access Private
router.delete("/users/:id", (req, res) => {
  console.log(req.params.id);
  User.deleteOne({ _id: req.params.id }).then(result => {
    res.send(result);
  });
});

module.exports = router;

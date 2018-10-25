const express = require("express");
const router = express.Router();
const User = require("./user");

router.get("/users", (req, res) => {
  User.find({}).then(users => {
    res.send(users);
  });
});

router.post("/users", (req, res) => {
  User.create(req.body).then(user => {
    res.send(user);
  });
});

router.put("/users/:id", (req, res) => {
  User.updateOne({ _id: req.params.id }, req.body).then(result => {
    res.send(result);
  });
});

router.delete("/users/:id", (req, res) => {
  console.log(req.params.id);
  User.deleteOne({ _id: req.params.id }).then(result => {
    res.send(result);
  });
});

module.exports = router;

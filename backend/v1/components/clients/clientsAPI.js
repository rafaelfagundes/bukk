const express = require("express");
const router = express.Router();
const Client = require("./client");

router.get("/clients", (req, res) => {
  Client.find({}).then(clients => {
    res.send(clients);
  });
});

router.post("/clients", (req, res) => {
  Client.create(req.body).then(client => {
    res.send(client);
  });
});

router.put("/clients/:id", (req, res) => {
  Client.updateOne({ _id: req.params.id }, req.body).then(result => {
    res.send(result);
  });
});

router.delete("/clients/:id", (req, res) => {
  Client.deleteOne({ _id: req.params.id }).then(result => {
    res.send(result);
  });
});

module.exports = router;

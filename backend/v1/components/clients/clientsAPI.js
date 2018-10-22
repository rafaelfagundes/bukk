const express = require("express");
const router = express.Router();

router.get("/clients", (req, res) => {
  res.send({ type: "GET" });
});

router.post("/clients", (req, res) => {
  res.send({ type: "POST" });
});

router.put("/clients/:id", (req, res) => {
  res.send({ type: "PUT" });
});

router.delete("/clients/:id", (req, res) => {
  res.send({ type: "DELETE" });
});

module.exports = router;

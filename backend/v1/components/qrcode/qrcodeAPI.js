const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const ical = require("ical-generator");

router.post("/qrcode/event", (req, res) => {
  let _event = ical({
    domain: "bukk.com.br",
    prodId: "//bukk.com.br//bukk//PT",
    events: [
      {
        start: req.body.start, // Ex.: 2019-01-23T18:25:43.511Z
        end: req.body.end, // Ex.: 2019-01-23T19:25:43.511Z
        summary: req.body.summary, // Event description
        alarms: req.body.alarms, // { "type": "audio", "trigger": 86400} => seconds before event
        organizer: req.body.organizer, // {"name":"Vito Corleone", "email":"vito@corleone.com"}
        location: req.body.location // Complete address in a String
      }
    ]
  }).toString();

  QRCode.toDataURL(_event)
    .then(_qrcode => {
      res.status(200).json(_qrcode);
    })
    .catch(err => {
      console.error(err);
      res.status(404).send("");
    });
});

module.exports = router;

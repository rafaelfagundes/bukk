const express = require("express");
const router = express.Router();
const Mail = require("./Mail");

router.post("/send/mail", (req, res) => {
  const data = {
    from: "no-reply@bukk.com.br",
    to: "rafaelcflima@gmail.com",
    subject: "Teste de email " + String(Math.random()),
    text: "Teste de email " + String(Math.random())
  };

  const mail = new Mail(data.subject, data.text, data.to);
  const result = mail.send();
  console.dir(result);

  res.status(200);
  res.send(result);
});

module.exports = router;

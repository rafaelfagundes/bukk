const keys = require("../../config/config");
const api_key = keys.mailgun.key;
const domain = keys.mailgun.domain;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

class Mail {
  constructor(subject, text, html, to, from = keys.mailgun.defaultEmail) {
    this.data = {
      from,
      to,
      subject,
      text,
      html
    };
  }
  send() {
    mailgun.messages().send(this.data, function(error, body) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email enviado com sucesso!");
      }
    });
  }
}

module.exports = Mail;

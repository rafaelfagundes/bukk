const keys = require("../../config/keys");
const api_key = keys.mailgun.key;
const domain = keys.mailgun.domain;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });
// TODO: create HTML email
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
    console.dir(this.data);
    mailgun.messages().send(this.data, function(error, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(body);
      }
    });
  }
}

module.exports = Mail;

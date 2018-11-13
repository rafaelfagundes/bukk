const keys = require("../../config/keys.js");
const api_key = keys.mailgun.key;
const domain = keys.mailgun.domain;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });
// TODO: create HTML email
class Mail {
  constructor(_subject, _message, _to, _from = keys.mailgun.defaultEmail) {
    this.data = {
      from: _from,
      to: _to,
      subject: _subject,
      text: _message
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

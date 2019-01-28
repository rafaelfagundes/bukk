// External Dependancies
const boom = require("boom");
const mongoose = require("mongoose");
const moment = require("moment");
const shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

// Get Data Models
const Appointment = require("./Appointment");
const Costumer = require("../costumer/Costumer");

const Mail = require("../mail/Mail");
const templates = require("../mail/templates/emailTemplates");

// Aux functions

const checkEmptyTimeInSchedule = async services => {
  const jobs = [];

  services.forEach(service => {
    jobs.push(
      Appointment.find({
        employee: mongoose.Types.ObjectId(service.specialistId),
        $or: [
          {
            $and: [
              { start: { $gte: moment(service.start).toDate() } },
              { start: { $lt: moment(service.end).toDate() } }
            ]
          },
          {
            $and: [
              { end: { $gt: moment(service.start).toDate() } },
              { end: { $lt: moment(service.end).toDate() } }
            ]
          }
        ]
      })
    );
  });

  const result = await Promise.all(jobs);

  let _resultsCounter = 0;
  result.forEach((r, index) => {
    _resultsCounter += result[index].length;
  });

  return _resultsCounter === 0 ? true : false;
};

// Add a new appointment
exports.addAppointment = async (req, res) => {
  const okToContinue = await checkEmptyTimeInSchedule(req.body.services);
  if (okToContinue) {
    try {
      const _confirmationId = shortid.generate();
      const _client = req.body.client; // Costumer
      const _services = req.body.services;

      const costumer = new Costumer({
        firstName: _client.firstName,
        lastName: _client.lastName,
        email: _client.email,
        gender: _client.gender,
        phone: [{ number: _client.phone, whatsapp: _client.whatsapp }],
        company: req.body.companyId
      });

      const resultCostumer = await costumer.save();

      let _appointments = [];
      _services.forEach(_service => {
        let _appointment = {
          confirmationId: _confirmationId,
          costumer: resultCostumer._id,
          employee: _service.specialistId,
          company: req.body.companyId,
          service: _service.serviceId,
          start: _service.start,
          end: _service.end,
          status: "created",
          notes: _client.obs
        };

        _appointments.push(_appointment);
      });

      const resultAppointment = await Appointment.create(_appointments);

      if (resultAppointment) {
        const template = await templates.newAppointment(_confirmationId);
        const mail = new Mail(
          "Agendamento concluído com sucesso",
          template.text,
          template.html,
          _client.email,
          "no-reply@bukk.com.br"
        );
        mail.send();

        res.send({
          confirmationId: _confirmationId,
          status: "confirmed",
          msg: "Agendamento concluído com sucesso",
          client: _client,
          services: _services
        });
      } else {
        res.send({
          status: "error",
          msg: "Houve um erro ao agendar. Tente novamente."
        });
      }
    } catch (err) {
      throw boom.boomify(err);
    }
  } else {
    res.send({
      status: "error",
      msg:
        "A data e horário escolhidos não estão mais disponíveis. Tente novamente em outro horário."
    });
  }
};

// Delete an appointment
exports.deleteAppointmentViaUrl = async (req, res) => {
  try {
    reply.code(200);
    reply.header("Content-Type", "text/html");
    reply.type("text/html");

    const _id = req.params.id;
    const _email = req.params.email;

    const appointments = await Appointment.aggregate([
      {
        $lookup: {
          from: "costumers",
          localField: "costumer",
          foreignField: "_id",
          as: "costumer"
        }
      },
      {
        $unwind: {
          path: "$costumer"
        }
      },
      {
        $match: {
          confirmationId: _id,
          "costumer.email": _email
        }
      },
      {
        $project: {
          _id: 1,
          "costumer.firstName": 1
        }
      }
    ]);

    let ids = [];
    appointments.forEach(app => {
      ids.push(app._id);
    });

    const result = await Appointment.deleteMany({ _id: { $in: ids } });
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Agendamento cancelado</title>
        <link
          href="https://fonts.googleapis.com/css?family=Lato"
          rel="stylesheet"
        />
        <style>
          * {
            font-family: Lato, sans-serif;
          }
          .container {
            margin: 40px 0 0 0;
            text-align: center;
            padding: 20px;
          }
          .icon {
            width: 150px;
            opacity: 0.75;
          }
          h1 {
            color: #a93e3e;
          }
          p {
            opacity: 0.75;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img
            class="icon"
            src="https://res.cloudinary.com/bukkapp/image/upload/v1546886912/Bukk/Assets/Email/calendar.png"
            alt="Agendamento cancelado"
          />
          <h1>Agendamento Cancelado</h1>
          <p>${
            appointments[0].costumer.firstName
          }, seu agendamento foi cancelado.</p>
          <p>Caso mude de ideia, faça um novo agendamento.</p>
        </div>
      </body>
    </html>
    `;
  } catch (err) {
    throw boom.boomify(err);
  }
};

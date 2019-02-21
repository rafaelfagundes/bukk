const boom = require("boom");
const mongoose = require("mongoose");
const moment = require("moment");
const auth = require("../../auth");
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
  console.log("@checkEmptyTimeInSchedule");
  const jobs = [];

  services.forEach(service => {
    jobs.push(
      Appointment.find({
        employee: mongoose.Types.ObjectId(service.specialistId),
        status: { $in: ["created", "confirmed"] },
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

// Add a new appointment via dashboard
exports.addAppointmentViaDashboard = async (req, res) => {
  const { appointment, isNewClient, client } = req.body;

  const _service = [
    {
      specialistId: appointment.employee,
      start: appointment.start,
      end: appointment.end
    }
  ];

  // console.log(_service);

  const okToContinue = await checkEmptyTimeInSchedule(_service);
  if (okToContinue) {
    try {
      const _confirmationId = shortid.generate();
      appointment.confirmationId = _confirmationId;
      const _costumer = {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: [{ number: client.phone, whatsApp: client.whatsApp }],
        gender: client.gender
      };

      if (isNewClient) {
        const costumer = await Costumer.create(_costumer);
        appointment.costumer = costumer._id;

        if (costumer) {
          const resultAppointment = await Appointment.create(appointment);

          if (resultAppointment) {
            res.status(200).send({ msg: "OK" });
          } else {
            res.status(500).send({ msg: "Erro ao criar agendamento" });
          }
        }
      } else {
        const costumer = await Costumer.updateOne(
          { _id: appointment.costumer },
          _costumer
        );

        if (costumer.ok) {
          const resultAppointment = await Appointment.create(appointment);

          if (resultAppointment) {
            res.status(200).send({ msg: "OK", appointment: resultAppointment });
          } else {
            res.status(500).send({ msg: "Erro ao criar agendamento" });
          }
        }
      }
    } catch (error) {
      res.status(500).send({ msg: `Erro ao criar agendamento: ${error}` });
    }
  } else {
    res.status(500).send({
      msg:
        "A data e horário escolhidos não estão mais disponíveis. Tente novamente em outro horário."
    });
  }
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
        phone: [{ number: _client.phone, whatsApp: _client.whatsapp }],
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
      console.log("resultAppointment", resultAppointment);

      if (resultAppointment) {
        const template = await templates.newAppointment(_confirmationId);
        const mail = new Mail(
          "Agendamento concluído com sucesso",
          template.text,
          template.html,
          _client.email,
          "Bukk Agendador <no-reply@bukk.com.br>"
        );
        mail.send(); // TODO: transformar em evento

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
    res.status(500).send({
      status: "error",
      msg:
        "A data e horário escolhidos não estão mais disponíveis. Tente novamente em outro horário."
    });
  }
};

exports.getAllAppointments = async (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Token inválido."
    });
  }

  try {
    let _match = {
      company: mongoose.Types.ObjectId(token.company)
    };
    if (token.role === "employee") {
      _match["employee"] = mongoose.Types.ObjectId(token.employee);
    }
    const appointments = await Appointment.aggregate([
      {
        $match: _match
      },
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employee"
        }
      },
      {
        $unwind: {
          path: "$employee"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "employee.user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user"
        }
      },
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
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      {
        $unwind: {
          path: "$service"
        }
      },
      {
        $sort: {
          start: 1
        }
      }
    ]);
    res.status(200).send({ msg: "OK", appointments });
  } catch (error) {
    res.status(500).send({ msg: "Erro ao listar agendamentos" });
  }
};

exports.getOneAppointment = async (req, res) => {
  const token = auth.verify(req.token);
  if (!token) {
    res.status(403).json({
      msg: "Token inválido."
    });
  }
  try {
    let _match = {
      company: mongoose.Types.ObjectId(token.company),
      _id: mongoose.Types.ObjectId(req.body.id)
    };
    if (token.role === "employee") {
      _match["employee"] = mongoose.Types.ObjectId(token.employee);
    }

    const appointments = await Appointment.aggregate([
      {
        $match: _match
      },
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employee"
        }
      },
      {
        $unwind: {
          path: "$employee"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "employee.user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user"
        }
      },
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
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service"
        }
      },
      {
        $unwind: {
          path: "$service"
        }
      },
      {
        $sort: {
          start: 1
        }
      },
      {
        $project: {
          "user.firstName": 1,
          "user.lastName": 1,
          "employee.title": 1,
          "service.desc": 1,
          "service.value": 1,
          "service.duration": 1,
          "costumer.firstName": 1,
          "costumer.lastName": 1,
          "costumer.gender": 1,
          "costumer.email": 1,
          "costumer.phone": 1,
          start: 1,
          end: 1,
          notes: 1,
          status: 1
        }
      }
    ]);
    res.status(200).send({ msg: "OK", appointment: appointments[0] });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Erro ao recuperar agendamento" });
  }
};

// Update one appointment
exports.updateOne = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    let _match = { _id: req.body._id, company: token.company };

    if (token.role === "employee") {
      _match["employee"] = token.employee;
    }

    const update = await Appointment.updateOne(_match, req.body);

    if (update.ok) {
      res.status(200).send({ msg: "OK" });
    } else {
      res.status(500).send({ msg: "Erro ao atualizar agendamento" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Update many appointments
exports.updateMany = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    let _match = { company: token.company };

    if (token.role === "employee") {
      _match["employee"] = token.employee;
    }

    console.log(req.body);
    console.log(_match);

    let _ops = [];

    req.body.forEach(appointment => {
      let op = {
        updateOne: {
          filter: { _id: appointment._id },
          update: { start: appointment.start, end: appointment.end }
        }
      };
      _ops.push(op);
    });

    // console.dir(JSON.stringify(_ops));

    const update = await Appointment.bulkWrite(_ops);
    console.log(update);
    if (update.ok) {
      res.status(200).send({ msg: "OK" });
    } else {
      res.status(500).send({ msg: "Erro ao atualizar agendamento" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Delete an appointment
exports.deleteAppointmentViaUrl = async (req, res) => {
  try {
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
    res.set("Content-Type", "text/html");
    res.status(200).send(`<!DOCTYPE html>
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
    `);
  } catch (err) {
    res
      .status(500)
      .send(
        "Não foi possível cancelar agendamento. Entre em contato com a empresa."
      );
  }
};

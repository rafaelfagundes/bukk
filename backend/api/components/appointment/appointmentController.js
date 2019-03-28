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
const Service = require("../service/Service");
const Employee = require("../employee/Employee");
const User = require("../user/User");

const Mail = require("../mail/Mail");
const templates = require("../mail/templates/emailTemplates");

/* ===============================================================================
  FILTERS
=============================================================================== */

const FILTER_APPOINTMENT = `confirmationId company start end status createdAt 
service.desc service.value service.duration user.firstName user.lastName 
costumer.firstName costumer.lastName costumer.gender costumer.email 
costumer.phone costumer.fullName employee.title`;

/* ============================================================================ */

// Aux functions
const checkEmptyTimeInSchedule = async services => {
  const jobs = [];

  services.forEach(service => {
    jobs.push(
      Appointment.find({
        "employee._id": mongoose.Types.ObjectId(service.specialistId),
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
  // Normaliza o objeto para ser compativel com o schema
  function normalizeCostumer(costumer) {
    let _costumer = costumer;
    _costumer.phone = [
      {
        number: costumer.phone,
        whatsApp: costumer.whatsApp
      }
    ];
    delete _costumer.whatsApp;

    return _costumer;
  }

  // Retorna o status dependendo da configurações da empresa
  // O sistema pode já confirmar o agendamento, ou será necessário um agendamento manual
  function getStatus(id) {
    // TODO: pegar configurações do banco

    return "created";
  }

  // Envia email caso o agendamento já tenha o status 'confirmed'
  function sendEmail() {}

  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }
    const { appointment, isNewClient, client } = req.body;

    // Verifica se tem tempo livre no horário
    const _service = [
      {
        specialistId: appointment.employee,
        start: appointment.start,
        end: appointment.end
      }
    ];
    const okToContinue = await checkEmptyTimeInSchedule(_service);
    if (!okToContinue) {
      res.status(404).send({ msg: "O horário já está reservado" });
      return false;
    }

    // Setting Costumer
    let costumer = undefined;
    if (isNewClient) {
      costumer = await Costumer.create(normalizeCostumer(client));
    } else {
      costumer = await Costumer.findById(appointment.costumer);
    }

    // Setting Service
    let service = await Service.findById(appointment.service);

    // Setting Employee
    let employee = await Employee.findById(appointment.employee);

    // Setting User
    let user = await User.findById(employee.user);

    // Get status
    let status = getStatus(token.company);

    const _appointment = {
      confirmationId: shortid.generate(),
      company: token.company,
      start: appointment.start,
      end: appointment.end,
      costumer,
      service,
      employee,
      user,
      status
    };

    // Salva agendamento no banco
    const resultAppointment = await Appointment.create(_appointment);
    if (resultAppointment) {
      // Envia email se a configuração já setar o agendamento como confirmado
      if (status === "confirmed") {
        sendEmail();
      }
      res.status(200).send({ msg: "Agendamento concluído com sucesso" });
    } else {
      res
        .status(500)
        .send({ msg: "Não foi possível criar um novo agendamento" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Não foi possível criar um novo agendamento" });
  }
};

// Add a new appointment
exports.addAppointment = async (req, res) => {
  console.time("@addAppointment");

  // Retorna o status dependendo da configurações da empresa
  // O sistema pode já confirmar o agendamento, ou será necessário um agendamento manual
  function getStatus(id) {
    // TODO: pegar configurações do banco

    return "created";
  }

  const okToContinue = await checkEmptyTimeInSchedule(req.body.services);
  if (!okToContinue) {
    res.status(500).send({
      status: "error",
      msg:
        "A data e horário escolhidos não estão mais disponíveis. Tente novamente em outro horário."
    });
    return false;
  }

  try {
    const _confirmationId = shortid.generate();
    const { client, services } = req.body;
    const costumerObj = new Costumer({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      gender: client.gender,
      phone: [{ number: client.phone, whatsApp: client.whatsapp }],
      company: req.body.companyId
    });

    const [costumer] = await Costumer.find({ email: client.email });

    let resultCostumer = undefined;

    if (costumer) {
      resultUpdateCostumer = await Costumer.updateOne(
        { id: costumer._id },
        costumerObj
      );
      if (resultUpdateCostumer) {
        resultCostumer = costumer;
      }
    } else {
      resultCostumer = await costumerObj.save();
    }

    let appointments = [];
    let _status = getStatus();
    for (const _service of services) {
      const service = await Service.findById(_service.serviceId);
      const employee = await Employee.findById(_service.specialistId);
      const user = await User.findById(employee.user);

      const _appointment = {
        confirmationId: _confirmationId,
        company: req.body.companyId,
        start: _service.start,
        end: _service.end,
        costumer: resultCostumer,
        service,
        employee,
        user,
        status: _status,
        notes: client.obs
      };

      appointments.push(_appointment);
    }

    const resultAppointment = await Appointment.create(appointments);
    if (resultAppointment) {
      if (_status === "confirmed") {
        console.log("enviando email...");
        // const template = await templates.newAppointment(_confirmationId);
        // const mail = new Mail(
        //   "Agendamento concluído com sucesso",
        //   template.text,
        //   template.html,
        //   client.email,
        //   "Bukk Agendador <no-reply@bukk.com.br>"
        // );
        // mail.send(); // TODO: transformar em evento
        res.send({
          confirmationId: _confirmationId,
          status: _status,
          msg: "Agendamento concluído com sucesso",
          client,
          services
        });
      } else {
        res.send({
          confirmationId: _confirmationId,
          status: _status,
          msg: "Aguarde a confirmação do agendamento",
          client,
          services
        });
      }
    } else {
      res.send({
        status: "error",
        msg: "Houve um erro ao agendar. Tente novamente."
      });
    }

    console.timeEnd("@addAppointment");
  } catch (error) {}
};

// Add a new appointment
exports.addAppointment2 = async (req, res) => {
  const okToContinue = await checkEmptyTimeInSchedule(req.body.services);
  if (okToContinue) {
    try {
      const _confirmationId = shortid.generate();
      const _client = req.body.client; // Costumer
      const _services = req.body.services;

      const costumerObj = new Costumer({
        firstName: _client.firstName,
        lastName: _client.lastName,
        email: _client.email,
        gender: _client.gender,
        phone: [{ number: _client.phone, whatsApp: _client.whatsapp }],
        company: req.body.companyId
      });

      const [costumer] = await Costumer.find({ email: _client.email });

      let resultCostumer = undefined;

      if (costumer) {
        resultUpdateCostumer = await Costumer.updateOne(
          { id: costumer._id },
          costumerObj
        );
        if (resultUpdateCostumer) {
          resultCostumer = costumer;
        }
      } else {
        resultCostumer = await costumerObj.save();
      }

      let _appointments = [];
      _services.forEach(_service => {
        console.log(_service);
        let _appointment = {
          confirmationId: _confirmationId,
          costumer: resultCostumer._id,
          employee: _service.specialistId,
          company: req.body.companyId,
          service: _service.serviceId,
          start: _service.start,
          end: _service.end,
          value: _service.value,
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

// Get All Appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    let params = {};
    if (token.role === "employee") {
      params = {
        company: token.company,
        "employee._id": mongoose.Types.ObjectId(token.employee)
      };
    } else {
      params = { company: token.company };
    }
    let appointments = await Appointment.find(params, FILTER_APPOINTMENT);

    if (appointments.length) {
      res.status(200).send({ msg: "OK", appointments });
    } else {
      res.status(404).send({ msg: "Nenhum agendamento encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Erro ao procurar agendamentos", error });
  }
};

// Get All Client Appointments
exports.getAllClientAppointments = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    let params = {};
    if (token.role === "employee") {
      params = {
        "costumer._id": mongoose.Types.ObjectId(req.body.id),
        company: token.company,
        "employee._id": mongoose.Types.ObjectId(token.employee)
      };
    } else {
      params = {
        "costumer._id": mongoose.Types.ObjectId(req.body.id),
        company: token.company
      };
    }

    let appointments = await Appointment.find(params, FILTER_APPOINTMENT);
    if (appointments.length) {
      res.status(200).send({ msg: "OK", appointments });
    } else {
      res.status(404).send({ msg: "Nenhum agendamento encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Erro ao procurar agendamentos", error });
  }
};

// Get One Appointment
exports.getOneAppointment = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    let params = {};
    if (token.role === "employee") {
      params = {
        _id: mongoose.Types.ObjectId(req.body.id),
        company: token.company,
        "employee._id": mongoose.Types.ObjectId(token.employee)
      };
    } else {
      params = { company: token.company, _id: req.body.id };
    }
    let [appointment] = await Appointment.find(params, FILTER_APPOINTMENT);

    console.log(appointment);

    res.status(200).send({ msg: "OK", appointment });
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
    res.status(500).send({ msg: error });
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
    if (update.ok) {
      res.status(200).send({ msg: "OK" });
    } else {
      res.status(500).send({ msg: "Erro ao atualizar agendamento" });
    }
  } catch (error) {
    res.status(500).send({ msg: error });
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

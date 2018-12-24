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

// Get all appointments
exports.getAppointments = async (req, reply) => {
  try {
    const appointments = await Appointment.find();
    return appointments;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get single appointment by ID
exports.getSingleAppointment = async (req, reply) => {
  try {
    const id = req.params.id;
    const appointment = await Appointment.findById(id);
    return appointment;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Add a new appointment
exports.addAppointment = async (req, reply) => {
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
        // TODO: Send email

        const template = await templates.newAppointment(_confirmationId);
        const mail = new Mail(
          "Agendamento concluído com sucesso",
          template.text,
          template.html,
          _client.email,
          "no-reply@bukk.com.br"
        );
        mail.send();

        return {
          confirmationId: _confirmationId,
          status: "confirmed",
          msg: "Agendamento concluído com sucesso",
          client: _client,
          services: _services
        };
      } else {
        return {
          status: "error",
          msg: "Houve um erro ao agendar. Tente novamente."
        };
      }
    } catch (err) {
      throw boom.boomify(err);
    }
  } else {
    return {
      status: "error",
      msg:
        "A data e horário escolhidos não estão mais disponíveis. Tente novamente em outro horário."
    };
  }
};

// Update an existing appointment
exports.updateAppointment = async (req, reply) => {
  try {
    const id = req.params.id;
    const appointment = req.body;
    const { ...updateData } = appointment;
    const update = await Appointment.findByIdAndUpdate(id, updateData, {
      new: true
    });
    return update;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Delete a appointment
exports.deleteAppointment = async (req, reply) => {
  try {
    const id = req.params.id;
    const appointment = await Appointment.findByIdAndRemove(id);
    return appointment;
  } catch (err) {
    throw boom.boomify(err);
  }
};

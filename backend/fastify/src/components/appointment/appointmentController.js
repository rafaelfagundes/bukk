// External Dependancies
const boom = require("boom");

// Get Data Models
const Appointment = require("./Appointment");
const Costumer = require("../costumer/Costumer");

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
  console.log("\n-------------------------------\n");
  try {
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

    return {
      status: "confirmed",
      msg: "Agendamento concluído com sucesso",
      client: _client,
      services: _services
    };
  } catch (err) {
    throw boom.boomify(err);
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

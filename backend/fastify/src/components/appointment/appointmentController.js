// External Dependancies
const boom = require("boom");

// Get Data Models
const Appointment = require("./Appointment");

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
  try {
    const appointment = new Appointment(req.body);
    return appointment.save();
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

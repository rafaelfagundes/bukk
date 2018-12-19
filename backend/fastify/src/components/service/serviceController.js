// External Dependancies
const boom = require("boom");

// Get Data Models
const Service = require("./Service");

// Get all services
exports.getServices = async (req, reply) => {
  try {
    const services = await Service.find();
    return services;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get all services by company
exports.getServicesByCompany = async (req, reply) => {
  try {
    const companyId = req.params.companyId;
    const services = await Service.find(
      { company: companyId },
      "id desc value duration company"
    );
    return services;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get single service by ID
exports.getSingleService = async (req, reply) => {
  try {
    const id = req.params.id;
    const service = await Service.findById(id);
    return service;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Add a new service
exports.addService = async (req, reply) => {
  try {
    const service = new Service(req.body);
    return service.save();
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Update an existing service
exports.updateService = async (req, reply) => {
  try {
    const id = req.params.id;
    const service = req.body;
    const { ...updateData } = service;
    const update = await Service.findByIdAndUpdate(id, updateData, {
      new: true
    });
    return update;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Delete a service
exports.deleteService = async (req, reply) => {
  try {
    const id = req.params.id;
    const service = await Service.findByIdAndRemove(id);
    return service;
  } catch (err) {
    throw boom.boomify(err);
  }
};

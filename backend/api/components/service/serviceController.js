// External Dependancies
const boom = require("boom");

// Get Data Models
const Service = require("./Service");

// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    return services;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get all services by company
exports.getServicesByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    console.log("companyId", companyId);
    const services = await Service.find(
      { company: companyId },
      "id desc value duration company"
    );
    res.send(services);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get single service by ID
exports.getSingleService = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await Service.findById(id);
    return service;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Add a new service
exports.addService = async (req, res) => {
  try {
    const service = new Service(req.body);
    return service.save();
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Update an existing service
exports.updateService = async (req, res) => {
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
exports.deleteService = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await Service.findByIdAndRemove(id);
    return service;
  } catch (err) {
    throw boom.boomify(err);
  }
};

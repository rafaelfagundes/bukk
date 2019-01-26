// External Dependancies
const boom = require("boom");
const auth = require("../../auth");

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

// Get all services by company [POST]
exports.companyServices = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    } else {
      const services = await Service.find(
        { company: req.body._id },
        "id desc value duration display"
      );
      res.send(services);
    }
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

// Update an existing service [POST]
exports.updateCompanyServices = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    } else {
      const _companyId = req.body.companyId;
      const _services = req.body.services;

      for (let s in _services) {
        if (_services[s]._id === undefined) {
          _services[s].company = _companyId;
          await Service.create(_services[s]);
        } else {
          _services[s].company = _companyId;
          await Service.update(
            { _id: _services[s]._id, company: _companyId },
            _services[s]
          );
        }
      }

      const _servicesResult = await Service.find(
        { company: _companyId },
        "id desc value duration display"
      );

      res.send({ msg: "OK", services: _servicesResult });
    }
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

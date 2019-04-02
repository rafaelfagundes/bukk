// External Dependancies
const boom = require("boom");
const auth = require("../../auth");
const _ = require("lodash");

// Get Data Models
const Service = require("./Service");
const Employee = require("../employee/Employee");

// Get all services
exports.getServicesByEmployee = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }
    const { id } = req.body;
    const employee = await Employee.findById(id);
    const servicesCompany = await Service.find({ company: token.company });

    const _servicesCompany = JSON.parse(JSON.stringify(servicesCompany));
    _servicesCompany.forEach(s => {
      s.checked = false;
      employee.services.forEach(si => {
        if (String(s._id) === String(si)) {
          s.checked = true;
        }
      });
    });

    console.log("_servicesCompany", _servicesCompany);

    res.status(200).send({ msg: "OK", services: _servicesCompany });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Erro ao recuperar os serviços" });
  }
};

// Get all services by company
exports.getServicesByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const services = await Service.find(
      { company: companyId },
      "id desc value duration company"
    ).sort({ desc: 1 });
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
      let services = undefined;
      if (token.role === "owner") {
        services = await Service.find(
          { company: token.company },
          "id desc value duration display"
        ).sort({ desc: 1 });
      } else {
        services = await Service.find(
          { company: token.company },
          "id desc value duration"
        ).sort({ desc: 1 });
      }
      res.send(services);
    }
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get single service by ID
exports.getSingleService = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    } else {
      const service = await Service.findById(
        req.body.id,
        "-company -createdAt"
      );
      if (service) {
        res.status(200).send({ msg: "OK", service });
      } else {
        res.status(400).send({ msg: "Serviço não encontrado" });
      }
    }
  } catch (error) {
    res.status(500).send({ msg: error });
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

// Add Service
exports.addCompanyService = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    } else {
      console.log("req.body", req.body);
      req.body["company"] = token.company;
      const result = await Service.create(req.body);
      if (result) {
        res.status(200).send({ msg: "Serviço atualizado com sucesso." });
      } else {
        res.status(500).send({ msg: "Erro ao atualizar o serviço." });
      }
    }
  } catch (error) {
    res.status(500).send({ msg: error });
  }
};

// Update Service
exports.updateCompanyService = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    } else {
      const result = await Service.updateOne({ _id: req.body._id }, req.body);

      if (result.ok) {
        res.status(200).send({ msg: "Serviço atualizado com sucesso." });
      } else {
        res.status(500).send({ msg: "Erro ao atualizar o serviço." });
      }
    }
  } catch (error) {
    res.status(500).send({ msg: error });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    } else {
      const result = await Service.deleteOne({ _id: req.body.id });
      console.log("result", result);

      if (result.ok) {
        res.status(200).send({ msg: "Serviço removido com sucesso." });
      } else {
        res.status(500).send({ msg: "Erro ao remover o serviço." });
      }
    }
  } catch (error) {
    res.status(500).send({ msg: error });
  }
};

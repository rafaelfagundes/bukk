// External Dependancies
const boom = require("boom");

// Get Data Models
const Company = require("./Company");

// Get all companies
exports.getCompanies = async (req, reply) => {
  try {
    const companies = await Company.find();
    return companies;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get single company by ID
exports.getSingleCompany = async (req, reply) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);
    return company;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Add a new company
exports.addCompany = async (req, reply) => {
  try {
    const company = new Company(req.body);
    return company.save();
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Update an existing company
exports.updateCompany = async (req, reply) => {
  try {
    const id = req.params.id;
    const company = req.body;
    const { ...updateData } = company;
    const update = await Company.findByIdAndUpdate(id, updateData, {
      new: true
    });
    return update;
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Delete a company
exports.deleteCompany = async (req, reply) => {
  try {
    const id = req.params.id;
    const company = await Company.findByIdAndRemove(id);
    return company;
  } catch (err) {
    throw boom.boomify(err);
  }
};

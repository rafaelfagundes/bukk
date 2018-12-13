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

// Get company CSS
exports.getCompanyCss = async (req, reply) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);

    reply.code(200);
    reply.header("Content-Type", "text/css");
    reply.type("text/css");
    return `
    body{
      display: block
    }
    h1,h2,h3 {
      color: ${company.settings.colors.primary} !important
    }
    .booker-header{ background-color: ${
      company.settings.colors.header
    } !important}
    .breadcrumbs-page-number{
      border-color: ${company.settings.colors.primary} !important;
      color: ${company.settings.colors.primary} !important
    }
    .breadcrumbs-page-number__active{
      background-color: ${company.settings.colors.primary} !important;
      color: ${company.settings.colors.contrastColor} !important
    }
    .breadcrumbs-page-numbers::before{
      background-color: ${company.settings.colors.primary} !important;
    }
    .specialist-img__selected {
      border: 5px solid ${company.settings.colors.primary} !important;
    }
    .selected-pill{
      background-color: ${company.settings.colors.primary} !important;
      color: ${company.settings.colors.contrastColor} !important
    }
    .react-datepicker__day--selected{
      background-color: ${company.settings.colors.primary} !important;
      color: ${company.settings.colors.contrastColor} !important
    }
    .ui.primary.button{
      background-color: ${company.settings.colors.primary} !important;
      color: ${company.settings.colors.contrastColor} !important
    }
    .service-price-container {
      background-color: ${company.settings.colors.primary} !important;
      color: ${company.settings.colors.contrastColor} !important
    }
    .service-remove-btn{
      color: ${company.settings.colors.primary} !important;
    }
    .ticket-company-details-web a {
      color: ${company.settings.colors.primary} !important;
    }
    .help-tooltip {
      color: ${company.settings.colors.primary} !important;
    }
    .service-remove{
      color: ${company.settings.colors.primary} !important;
    }
    .service-remove-btn{
      color: ${company.settings.colors.primary} !important;
    }
    .confirmation{
      background-color: ${company.settings.colors.confirmation} !important;
      color: ${company.settings.colors.confirmationContrastColor} !important
    }
    .PaymentDetails {
      background: hsl(${company.settings.colors.secondary}, 82%) !important;
      color: ${company.settings.colors.contrastColor} !important;
    }
    
    .payment-details-price {
      background: hsl(${company.settings.colors.secondary}, 52%) !important;
      color: ${company.settings.colors.contrastColor} !important;
    }
    .payment-details-price-total {
      background: hsl(${company.settings.colors.secondary}, 65%) !important;
      color: ${company.settings.colors.contrastColor} !important;
    }
    `;
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

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

    let customCss = `
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

    if (company.settings.options.disableMarginTopBooker) {
      customCss += `.Booker{margin: 0px auto 55px auto !important;}`;
    }
    if (company.settings.options.disableHeader) {
      customCss += `
      .Booker{border-top: 1px solid #eeeeee !important;}
      `;
    }
    if (company.settings.options.disableBorder) {
      customCss += `
      .Booker{border: none !important;}
      .booker-header {
        border-radius: 6px !important;
      }
      `;
    }
    if (company.settings.options.disableBorderRadius) {
      customCss += `
      .Booker *{border-radius: 0px !important}
      `;
    }
    if (company.settings.options.centerLogo) {
      customCss += `
      .booker-header-logo {
        margin: 0 auto !important;
        left: 0 !important;
      }
      `;
    }
    if (company.settings.options.roundedLogo) {
      customCss += `
      .booker-header-logo {
        border-radius: 50%;
        max-height: 56px;
        top: 50%;
        -webkit-transform: translateY(-28px);
        transform: translateY(-28px);
        left: 20px;
      }
      `;
    }

    if (company.settings.options.squareLogo) {
      customCss += `
      .booker-header-logo {

        max-height: 56px;
        top: 50%;
        -webkit-transform: translateY(-28px);
        transform: translateY(-28px);
        left: 20px;
      }
      `;
    }

    if (company.settings.options.softSquareLogo) {
      customCss += `
      .booker-header-logo {
        border-radius: 4px;
        max-height: 56px;
        top: 50%;
        -webkit-transform: translateY(-28px);
        transform: translateY(-28px);
        left: 20px;
      }
      `;
    }

    if (company.settings.options.showCompanyNickname) {
      customCss += `
      .booker-header-name {
        color: ${company.settings.colors.contrastColor} !important
      }`;
    }

    if (company.settings.options.disableLogo) {
      customCss += `
      .booker-header-name {
        top: 50% !important;
        left: 20px !important;
        transform: translateY(-14px) !important;
      }`;
    }

    if (company.settings.options.dropShadowBooker) {
      customCss += `
      .Booker {
        box-shadow: 0px 5px 20px rgba(0,0,0,.06) !important;
        border: none !important;
      }`;
    }
    if (company.settings.options.dropShadowComponents) {
      customCss += `
      input, textarea, .button, .button:disabled, .search, .specialist-img, .react-datepicker, .TimePills > .label,
      .DateTimePage table, .checkbox > label:before, .pointing.label, .breadcrumbs-page-number,
      .ClientInfo, .ServiceListItem, .PaymentDetails, .Ticket {
        box-shadow: 0px 2px 15px rgba(0,0,0,.06) !important;
      }`;
    }

    return customCss;
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

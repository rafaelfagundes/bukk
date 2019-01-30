// External Dependancies
const boom = require("boom");
const auth = require("../../auth");

// Get Data Models
const Company = require("./Company");
const User = require("../user/User");

// Get all companies
exports.getCompany = async (req, res) => {
  try {
    const token = auth.verify(req.token);
    if (!token) {
      res.status(403).json({
        msg: "Token inválido."
      });
    }

    const user = await User.findById(token.id);

    let company;
    if (user.role === "owner") {
      company = await Company.findById(
        user.company,
        "id address settings companyName tradingName companyNickname cpfCnpj businessType logo website email social workingDays phone paymentOptions"
      );
    } else {
      company = await Company.findById(
        user.company,
        "settings.colors companyNickname logo"
      );
    }
    res.status(200).send({ msg: "OK", company });
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get company CSS
exports.getCompanyCss = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);

    res.status(200);
    res.set("Content-Type", "text/css");

    let customCss = `
    body{
      display: block
    }
    h1,h2,h3 {
      color: ${company.settings.colors.primaryBack} !important
    }
    .booker-header{ background-color: ${
      company.settings.colors.headerBack
    } !important}
    .breadcrumbs-page-number{
      border-color: ${company.settings.colors.primaryBack} !important;
      color: ${company.settings.colors.primaryBack} !important
    }
    .breadcrumbs-page-number__active{
      background-color: ${company.settings.colors.primaryBack} !important;
      color: ${company.settings.colors.primaryText} !important
    }
    .breadcrumbs-page-numbers::before{
      background-color: ${company.settings.colors.primaryBack} !important;
    }
    .specialist-img__selected {
      border: 5px solid ${company.settings.colors.primaryBack} !important;
    }
    .selected-pill{
      background-color: ${company.settings.colors.primaryBack} !important;
      color: ${company.settings.colors.primaryText} !important
    }
    .react-datepicker__day--selected{
      background-color: ${company.settings.colors.primaryBack} !important;
      color: ${company.settings.colors.primaryText} !important
    }
    .ui.primary.button{
      background-color: ${company.settings.colors.primaryBack} !important;
      color: ${company.settings.colors.primaryText} !important
    }
    .service-price-container {
      background-color: ${company.settings.colors.primaryBack} !important;
      color: ${company.settings.colors.primaryText} !important
    }
    .service-remove-btn{
      color: ${company.settings.colors.primaryBack} !important;
    }
    .ticket-company-details-web a {
      color: ${company.settings.colors.primaryBack} !important;
    }
    .help-tooltip {
      color: ${company.settings.colors.primaryBack} !important;
    }
    .service-remove{
      color: ${company.settings.colors.primaryBack} !important;
    }
    .service-remove-btn{
      color: ${company.settings.colors.primaryBack} !important;
    }
    .confirmation{
      background-color: ${company.settings.colors.confirmationBack} !important;
      color: ${company.settings.colors.confirmationText} !important
    }
    .PaymentDetails {
      background: ${company.settings.colors.secondaryBack} !important;
      color: ${company.settings.colors.secondaryText} !important;
    }
    
    .payment-details-price {
      background: ${company.settings.colors.secondaryBack} !important;
      color: ${company.settings.colors.secondaryText} !important;
    }
    .payment-details-price-total {
      background: ${company.settings.colors.secondaryBack} !important;
      color: ${company.settings.colors.secondaryText} !important;
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
        color: ${company.settings.colors.primaryText} !important
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

    res.send(customCss);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get company Mobile CSS
exports.getCompanyMobileCss = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);

    res.status(200);
    res.set("Content-Type", "text/css");

    let customCss = `
    body{
      display: block
    }
    h1,h2,h3 {
      color: ${company.settings.colors.primaryBack} !important
    }
    .booker-header{ background-color: ${
      company.settings.colors.headerBack
    } !important}
    .breadcrumbs-page-number{
      border-color: ${company.settings.colors.primaryBack} !important;
      color: ${company.settings.colors.primaryBack} !important
    }
    .breadcrumbs-page-number__active{
      background-color: ${company.settings.colors.primaryBack} !important;
      color: ${company.settings.colors.primaryText} !important
    }
    .breadcrumbs-page-numbers::before{
      background-color: ${company.settings.colors.primaryBack} !important;
    }
    .specialist-img__selected {
      border: 5px solid ${company.settings.colors.primaryBack} !important;
    }
    .selected-pill{
      background-color: ${company.settings.colors.primaryBack} !important;
      color: ${company.settings.colors.primaryText} !important
    }
    .react-datepicker__day--selected{
      background-color: ${company.settings.colors.primaryBack} !important;
      color: ${company.settings.colors.primaryText} !important
    }
    .ui.primary.button{
      background-color: ${company.settings.colors.primaryBack} !important;
      color: ${company.settings.colors.primaryText} !important
    }
    .service-price-container {
      color: ${company.settings.colors.primaryBack} !important
    }
    .service-remove-btn{
      color: ${company.settings.colors.primaryBack} !important;
    }
    .ticket-company-details-web a {
      color: ${company.settings.colors.primaryBack} !important;
    }
    .help-tooltip {
      color: ${company.settings.colors.primaryBack} !important;
    }
    .service-remove{
      color: ${company.settings.colors.primaryBack} !important;
    }
    .service-remove-btn{
      color: ${company.settings.colors.primaryBack} !important;
    }
    .confirmation{
      background-color: ${company.settings.colors.confirmationBack} !important;
      color: ${company.settings.colors.confirmationText} !important
    }
    .PaymentDetails {
      background: ${company.settings.colors.secondaryBack} !important;
      color: ${company.settings.colors.primaryText} !important;
    }
    
    .payment-details-price {
      background: ${company.settings.colors.secondaryBack} !important;
      color: ${company.settings.colors.primaryText} !important;
    }
    .payment-details-price-total {
      background: ${company.settings.colors.secondaryBack} !important;
      color: ${company.settings.colors.primaryText} !important;
    }
    `;

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

    if (company.settings.options.dropShadowComponents) {
      customCss += `
      input, textarea, .button, .button:disabled, .search, .specialist-img, .react-datepicker, .TimePills > .label,
      .DateTimePage table, .checkbox > label:before, .pointing.label, .breadcrumbs-page-number,
      .ClientInfo, .ServiceListItem, .PaymentDetails, .Ticket {
        box-shadow: 0px 2px 15px rgba(0,0,0,.06) !important;
      }`;
    }

    res.send(customCss);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Get single company by ID
exports.getSingleCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(
      id,
      "id address settings companyNickname tradingName logo website email phone paymentOptions"
    );
    res.send(company);
  } catch (err) {
    throw boom.boomify(err);
  }
};

// Update an existing company
exports.updateCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const company = req.body;

    const result = await Company.updateOne({ _id: company._id }, company);

    console.log(result);

    if (result.ok === 1) {
      res.status(200).send({ msg: "OK" });
    } else {
      res
        .status(500)
        .send({ msg: "Não foi possível atualizar os dados da empresa" });
    }
  } catch (err) {
    res.status(500).send({ msg: err });
  }
};

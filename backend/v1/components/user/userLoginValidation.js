const validation = require("../../common/validation");

module.exports = function validateUser(data) {
  let errors = {};

  if (validation.isEmptyOrNotString(data.username)) {
    errors.username = "O nome de usuário ou email é obrigatório";
    fatalError = true;
  }

  if (validation.isEmptyOrNotString(data.password)) {
    errors.password = "A senha é obrigatória";
    fatalError = true;
  }

  return {
    errors,
    isValid: validation.isEmptyObject(errors)
  };
};

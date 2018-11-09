const validation = require("../../common/validation");

module.exports = function validateUser(data) {
  let errors = {};
  let fatalError = false;

  if (validation.isEmptyOrNotString(data.firstName)) {
    errors.firstName = "O primeiro nome é obrigatório";
    fatalError = true;
  }

  if (validation.isEmptyOrNotString(data.lastName)) {
    errors.lastName = "O sobrenome é obrigatório";
    fatalError = true;
  }

  if (validation.isEmptyOrNotString(data.username)) {
    errors.username = "O nome de usuário é obrigatório";
    fatalError = true;
  }

  if (validation.isEmptyOrNotString(data.email)) {
    errors.email = "O email é obrigatório";
    fatalError = true;
  }

  if (validation.isEmptyOrNotString(data.password)) {
    errors.password = "A senha é obrigatória";
    fatalError = true;
  }

  if (validation.isEmptyOrNotString(data.passwordConfirmation)) {
    errors.passwordConfirmation = "A confirmação de senha é obrigatória";
    fatalError = true;
  }

  if (fatalError) {
    return { errors, isValid: false };
  }

  if (!validation.isLength(data.firstName, { min: 2, max: 64 })) {
    errors.firstName = "O primeiro nome deve conter entre 2 e 64 caracteres";
  }

  if (!validation.isAlpha(data.firstName)) {
    errors.firstName = "O primeiro nome deve conter somenter letras";
  }

  if (!validation.isLength(data.lastName, { min: 2, max: 64 })) {
    errors.lastName = "O sobrenome deve conter entre 2 e 64 caracteres";
  }

  if (!validation.isAlpha(data.lastName)) {
    errors.lastName = "O sobrenome deve conter somenter letras";
  }

  if (!validation.isLength(data.username, { min: 4, max: 32 })) {
    errors.username = "O nome de usuário deve conter entre 4 e 32 caracteres";
  }

  if (!validation.isLength(data.username, { min: 4, max: 32 })) {
    errors.username = "O nome de usuário deve conter entre 4 e 32 caracteres";
  }

  if (!validation.isEmail(data.email)) {
    errors.email = "O email não é válido";
  }

  if (!validation.isLength(data.password, { min: 6 })) {
    errors.password = "A senha deve conter no mínimo 6 caracteres";
  }

  if (!validation.equals(data.password, data.passwordConfirmation)) {
    errors.password = "A senha e a confirmação de senha são diferentes";
  }

  if (!validation.isLength(data.password, { max: 64 })) {
    errors.passwordConfirmation = "A senha deve conter no máximo 64 caracteres";
  }

  return {
    errors,
    isValid: validation.isEmptyObject(errors)
  };
};

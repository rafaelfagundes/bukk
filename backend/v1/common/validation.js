const validator = require("validator");
const _ = require("lodash");

class Validation {
  equals(value1, value2) {
    return validator.equals(value1, value2);
  }
  isLength(value, ops = {}) {
    return validator.isLength(value, ops);
  }
  isEmail(value) {
    return validator.isEmail(value);
  }
  isAlpha(value) {
    return validator.isAlpha(value);
  }
  isEmptyOrNotString(value) {
    return (
      _.isEmpty(value) ||
      value === undefined ||
      value === null ||
      !_.isString(value)
    );
  }

  isEmptyObject(value) {
    return _.isEmpty(value);
  }
}

module.exports = new Validation();

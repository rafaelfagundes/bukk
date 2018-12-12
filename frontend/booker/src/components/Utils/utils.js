const _ = require("lodash");

exports.getSpecialist = (id, specialists) => {
  console.log(id);
  console.log(specialists);

  const index = _.findIndex(specialists, function(o) {
    return o.employee._id === id;
  });
  if (index >= 0) {
    return specialists[index];
  } else {
    return null;
  }
};
exports.getService = (id, services) => {
  const index = _.findIndex(services, function(o) {
    return o._id === id;
  });
  if (index >= 0) {
    return services[index];
  } else {
    return null;
  }
};

exports.generateUUID = () => {
  var d = new Date().getTime();
  if (Date.now) {
    d = Date.now(); //high-precision timer
  }
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};
